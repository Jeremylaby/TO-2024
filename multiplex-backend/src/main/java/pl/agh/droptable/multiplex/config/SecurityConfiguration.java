package pl.agh.droptable.multiplex.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import pl.agh.droptable.multiplex.service.CustomUserDetailsService;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfiguration(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(
                                "/",
                                "/auth/**",
                                "/h2-console/**",
                                "/api/genre",
                                "/api/seans/all/**",
                                "/api/seans/currently-playing",
                                "/api/seans/{id}/seats"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/movies/**").permitAll()

                        // Endpoints accessible by NORMAL_USER and above
                        .requestMatchers(
                                "/api/rate",
                                "/api/movies/recommendations/**",
                                "/api/reservation/**"
                        ).hasRole("NORMAL_USER")
                        .requestMatchers(
                                HttpMethod.POST, "/api/rate"
                        ).hasRole("NORMAL_USER")
                        .requestMatchers(
                                HttpMethod.GET, "/api/room"
                        ).hasRole("NORMAL_USER")
                        .requestMatchers(
                                HttpMethod.GET, "/api/room/{id}"
                        ).hasRole("NORMAL_USER")
                        .requestMatchers(
                                HttpMethod.GET, "/api/seans/{id}"
                        ).hasRole("NORMAL_USER")
                        .requestMatchers(
                                HttpMethod.DELETE, "/api/user/{id}"
                        ).hasRole("NORMAL_USER")

                        // Endpoints accessible by EMPLOYEE and above
                        .requestMatchers(
                                "/api/rate/**",
                                "/api/reservation/**",
                                "/api/room/all",
                                "/api/seans/**",
                                "/api/seat/**",
                                "/api/user/**"
                        ).hasRole("EMPLOYEE")

                        // Endpoints accessible by MANAGER and above
                        .requestMatchers(
                                "/api/analytics/**",
                                "/api/movies/**",
                                "/api/room/**"
                        ).hasRole("MANAGER")

                        // Endpoints accessible by ADMINISTRATOR only
                        .requestMatchers("/api/analytics").hasRole("ADMINISTRATOR")
                        .anyRequest().authenticated()
                )
                .formLogin(formLogin -> formLogin
                        .loginProcessingUrl("/auth/login")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().write("{\"message\": \"Login successful\"}");
                            response.getWriter().flush();
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("{\"error\": \"Invalid credentials\"}");
                            response.getWriter().flush();
                        })
                        .permitAll()
                )

                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
                .securityContext(context -> context
                        .securityContextRepository(securityContextRepository())
                )

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .httpBasic(withDefaults())
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().write("{\"message\": \"Logout successful\"}");
                            response.getWriter().flush();
                        })
                );

        return http.build();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
