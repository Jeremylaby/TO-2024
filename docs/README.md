# jk-sr-0800-droptable

## Opis projektu

### Problem

Zarządzanie multipleksem kinowym może być skomplikowane z powodu wielu sal, licznych seansów oraz potrzeby zarządzania dużą liczbą użytkowników.
System wymaga efektywnego sposobu rejestrowania i uwierzytelniania użytkowników, zarządzania ich danymi, a także integracji z przyszłymi funkcjami,
takimi jak rezerwacje miejsc czy obsługa repertuaru.

### Rozwiązanie

Aby rozwiązać te problemy, stworzyliśmy nowoczesną aplikację REST API, która jest oparta na:

- **Spring Boot**: Zapewnia wydajność, rozszerzalność i łatwość integracji.
- **Hibernate**: Ułatwia zarządzanie bazą danych przy użyciu ORM.
- **Spring Security**: Dba o bezpieczeństwo danych użytkowników, szczególnie haseł.

Dzięki zastosowaniu REST API aplikacja umożliwia:

- Rejestrację i logowanie użytkowników, w tym bezpieczne szyfrowanie haseł.
- Zarządzanie użytkownikami w przyjazny i bezpieczny sposób.
- Modularność systemu, ułatwiającą wprowadzanie nowych funkcji, takich jak:
  - Rezerwacje miejsc.
  - Planowanie repertuaru.
  - Raportowanie frekwencji czy sprzedaży biletów.

Projekt został zaprojektowany z myślą o skalowalności i łatwej możliwości integracji z bardziej zaawansowanymi funkcjami w przyszłości.

## Model Bazodanowy

![model](img/db.png)

## Kontrolery

### `AuthController`

`AuthController` zajmuje się obsługą rejestracji i logowaniem użytkowników w systemie Multiplex. Oferuje dwa główne punkty końcowe: rejestrację oraz logowanie.

#### **Rejestracja użytkownika**

**Endpoint:**  
`POST /auth/register`

**Opis:**  
Rejestruje nowego użytkownika w systemie.

**Treść żądania (`Request Body`):**

| Nazwa pola  | Typ    | Walidacja                                      | Opis                      |
| ----------- | ------ | ---------------------------------------------- | ------------------------- |
| `firstName` | String | Nie puste                                      | Imię użytkownika.         |
| `lastName`  | String | Nie puste                                      | Nazwisko użytkownika.     |
| `email`     | String | Unikalny email w poprawnym formacie, Nie pusty | Adres e-mail użytkownika. |
| `password`  | String | Nie puste                                      | Hasło do konta.           |

**Odpowiedź:**

- **Status 200 OK:** Rejestracja zakończona sukcesem.  
  Przykład odpowiedzi:

  ```json
  {
    "message": "Registration successful!"
  }
  ```

- **Status 400 Bad Request:** Podany adres e-mail jest już używany.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "User with this email already exists."
  }
  ```

---

#### **Logowanie użytkownika**

**Endpoint:**  
`POST /auth/login`

**Opis:**  
Autoryzuje istniejącego użytkownika i pozwala mu się zalogować do systemu.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ    | Walidacja                                   | Opis                      |
| ---------- | ------ | ------------------------------------------- | ------------------------- |
| `email`    | String | Email przynależny do użytkownika, Nie puste | Adres e-mail użytkownika. |
| `password` | String | Nie puste                                   | Hasło do konta.           |

**Odpowiedź:**

- **Status 200 OK:** Logowanie zakończone sukcesem.  
  Przykład odpowiedzi:

  ```json
  {
    "message": "Login successful!"
  }
  ```

- **Status 401 Unauthorized:** Logowanie nie powiodło się z powodu niepoprawnych danych logowania (np. błędny e-mail lub błędne hasło).  
  Przykład odpowiedzi:
  ```json
  {
    "error": "Invalid credentials."
  }
  ```

### `UserController`

`UserController` zajmuje się zarządzaniem danymi użytkowników w systemie Multiplex. Dostarcza punktów końcowych umożliwiających aktualizację danych użytkownika oraz usunięcie użytkownika na podstawie adresu e-mail.

---

#### **Aktualizacja użytkownika**

**Endpoint:**  
`PUT /user`

**Opis:**  
Aktualizuje dane istniejącego użytkownika lub dodaje nowego użytkownika do systemu, jeśli użytkownik nie istnieje.

**Treść żądania (`Request Body`):**

| Nazwa pola  | Typ    | Walidacja                                      | Opis                      |
| ----------- | ------ | ---------------------------------------------- | ------------------------- |
| `firstName` | String | Nie puste                                      | Imię użytkownika.         |
| `lastName`  | String | Nie puste                                      | Nazwisko użytkownika.     |
| `email`     | String | Unikalny email w poprawnym formacie, Nie pusty | Adres e-mail użytkownika. |
| `password`  | String | Nie puste                                      | Hasło użytkownika.        |

**Odpowiedź:**

- **Status 200 OK:** Zaktualizowano dane użytkownika lub dodano nowego użytkownika.  
  Przykład odpowiedzi:
  ```json
  {
    "firstName": "Adam",
    "lastName": "Nowak",
    "email": "adam.nowak@example.com",
    "password": "encodedPasswordHere"
  }
  ```

---

#### **Usunięcie użytkownika**

**Endpoint:**  
`DELETE /user/{id}`

**Opis:**  
Usuwa istniejącego użytkownika z systemu na podstawie id.
**Odpowiedź:**

- **Status 200 OK:** Użytkownik został usunięty z systemu.

- **Status 404 Not Found:** Użytkownik o podanym adresie e-mail nie istnieje w systemie.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "User with email adam.nowak@example.com not found."
  }
  ```

---

### `MovieController`

`MovieController` zajmuje się zarządzaniem filmami w systemie Multiplex. Oferuje punkty końcowe do dodawania, pobierania, aktualizacji oraz usuwania informacji o filmach.

#### **Dodanie nowego filmu**

**Endpoint:**  
`POST /movie`

**Opis:**  
Dodaje nowy film do systemu.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ         | Walidacja                 | Opis                            |
| ---------- | ----------- | ------------------------- | ------------------------------- |
| `title`    | String      | Nie puste                 | Tytuł filmu.                    |
| `director` | String      | Nie puste                 | Reżyser filmu.                  |
| `duration` | Integer     | Wartość dodatnia          | Czas trwania filmu w minutach.  |
| `genreIds` | List\<Long> | Istniejące identyfikatory | Lista ID przypisanych gatunków. |

**Odpowiedź:**

- **Status 200 OK:** Film został pomyślnie dodany.  
  Przykład odpowiedzi:
  ```json
  {
    "id": 1,
    "title": "Inception",
    "director": "Christopher Nolan",
    "duration": 148,
    "genres": ["Sci-Fi", "Thriller"]
  }
  ```

---

#### **Pobranie filmu po ID**

**Endpoint:**  
`GET /movie/:id`

**Opis:**  
Zwraca szczegóły filmu na podstawie jego ID.

**Odpowiedź:**

- **Status 200 OK:** Film został znaleziony.  
  Przykład odpowiedzi:

  ```json
  {
    "id": 1,
    "title": "Inception",
    "director": "Christopher Nolan",
    "duration": 148,
    "genres": ["Sci-Fi", "Thriller"]
  }
  ```

- **Status 404 Not Found:** Film o podanym ID nie istnieje.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "Movie not found."
  }
  ```

---

#### **Pobranie wszystkich filmów**

**Endpoint:**  
`GET /movie`

**Opis:**  
Zwraca listę wszystkich filmów w systemie.

**Odpowiedź:**

- **Status 200 OK:**  
  Przykład odpowiedzi:
  ```json
  [
    {
      "id": 1,
      "title": "Inception",
      "director": "Christopher Nolan",
      "duration": 148,
      "genres": ["Sci-Fi", "Thriller"]
    },
    {
      "id": 2,
      "title": "Interstellar",
      "director": "Christopher Nolan",
      "duration": 169,
      "genres": ["Sci-Fi", "Drama"]
    }
  ]
  ```

---

#### **Usunięcie filmu**

**Endpoint:**  
`DELETE /movie/:id`

**Opis:**  
Usuwa film z systemu na podstawie ID.

**Odpowiedź:**

- **Status 200 OK:** Film został pomyślnie usunięty.

- **Status 404 Not Found:** Film o podanym ID nie istnieje.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "Movie not found."
  }
  ```

---

#### **Aktualizacja filmu**

**Endpoint:**  
`PUT /movie`

**Opis:**  
Aktualizuje dane istniejącego filmu.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ         | Walidacja                 | Opis                            |
| ---------- | ----------- | ------------------------- | ------------------------------- |
| `title`    | String      | Nie puste                 | Tytuł filmu.                    |
| `director` | String      | Nie puste                 | Reżyser filmu.                  |
| `duration` | Integer     | Wartość dodatnia          | Czas trwania filmu w minutach.  |
| `genreIds` | List\<Long> | Istniejące identyfikatory | Lista ID przypisanych gatunków. |

**Odpowiedź:**

- **Status 200 OK:** Film został pomyślnie zaktualizowany.  
  Przykład odpowiedzi:
  ```json
  {
    "id": 1,
    "title": "Updated Title",
    "director": "Updated Director",
    "duration": 150,
    "genres": ["Updated Genre"]
  }
  ```

---

### `RoomController`

`RoomController` zajmuje się zarządzaniem salami kinowymi w systemie Multiplex. Oferuje punkty końcowe do dodawania, pobierania, aktualizacji oraz usuwania informacji o salach.

#### **Dodanie nowej sali**

**Endpoint:**  
`POST /room`

**Opis:**  
Dodaje nową salę kinową do systemu.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ    | Walidacja   | Opis                          |
| ---------- | ------ | ----------- | ----------------------------- |
| `name`     | String | Nie puste   | Nazwa sali kinowej.           |
| `capacity` | Int    | Wartość > 0 | Liczba miejsc w sali kinowej. |

**Odpowiedź:**

- **Status 200 OK:** Sala została pomyślnie dodana.  
  Przykład odpowiedzi:
  ```json
  {
    "id": 1,
    "name": "Room A",
    "capacity": 120
  }
  ```

---

#### **Pobranie sali po ID**

**Endpoint:**  
`GET /room/:id`

**Opis:**  
Zwraca szczegóły sali na podstawie jej ID.

**Odpowiedź:**

- **Status 200 OK:** Sala została znaleziona.  
  Przykład odpowiedzi:

  ```json
  {
    "id": 1,
    "name": "Room A",
    "capacity": 120
  }
  ```

- **Status 404 Not Found:** Sala o podanym ID nie istnieje.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "Room not found."
  }
  ```

---

#### **Pobranie wszystkich sal**

**Endpoint:**  
`GET /room`

**Opis:**  
Zwraca listę wszystkich sal w systemie.

**Odpowiedź:**

- **Status 200 OK:**  
  Przykład odpowiedzi:
  ```json
  [
    {
      "id": 1,
      "name": "Room A",
      "capacity": 120
    },
    {
      "id": 2,
      "name": "Room B",
      "capacity": 150
    }
  ]
  ```

---

#### **Aktualizacja sali**

**Endpoint:**  
`PUT /room`

**Opis:**  
Aktualizuje dane istniejącej sali.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ    | Walidacja   | Opis                          |
| ---------- | ------ | ----------- | ----------------------------- |
| `id`       | Long   | Nie puste   | ID sali.                      |
| `name`     | String | Nie puste   | Nazwa sali kinowej.           |
| `capacity` | Int    | Wartość > 0 | Liczba miejsc w sali kinowej. |

**Odpowiedź:**

- **Status 200 OK:** Sala została pomyślnie zaktualizowana.  
  Przykład odpowiedzi:
  ```json
  {
    "id": 1,
    "name": "Updated Room A",
    "capacity": 130
  }
  ```

---

#### **Usunięcie sali**

**Endpoint:**  
`DELETE /room/:id`

**Opis:**  
Usuwa salę kinową z systemu na podstawie ID.

**Odpowiedź:**

- **Status 200 OK:** Sala została pomyślnie usunięta.

- **Status 404 Not Found:** Sala o podanym ID nie istnieje.  
  Przykład odpowiedzi:

  ```json
  {
    "error": "Room not found."
  }
  ```

### `AnalyticsController`

`AnalyticsController` dostarcza analityki związanej z filmami i rezerwacjami w systemie Multiplex. Obecnie umożliwia pobranie informacji o najbardziej dochodowych filmach.

#### **Najbardziej dochodowe filmy**

**Endpoint:**  
`GET /analytics/movies`

**Opis:**  
Zwraca listę najbardziej dochodowych filmów w systemie.

**Odpowiedź:**

- **Status 200 OK:** Lista najbardziej dochodowych filmów.  
  Przykład odpowiedzi:
  ```json
  [
    {
      "movie": {
        "id": 1,
        "title": "Title",
        "director": "Director",
        "duration": 150,
        "genres": ["Genre"]
      },
      "revenue": 50000
    },
    {
      "title": {
        "id": 2,
        "title": "Title 2",
        "director": "d2",
        "duration": 130,
        "genres": ["Genre"]
      },
      "revenue": 45000
    }
  ]
  ```
Domyślnie zwracanych jest 10 najbardziej dochodowych filmów.

## Diagram Przepływu Logowania i Rejestracji

W celu lepszego zrozumienia, jak działa proces rejestracji i autoryzacji użytkowników w systemie, przedstawiamy diagram przepływu tego procesu. Diagram ilustruje kroki, które zachodzą od momentu wprowadzenia danych przez użytkownika, aż po ich zapis w bazie danych lub uwierzytelnienie użytkownika w systemie.

---

![auth-flow](img/auth_flow_diagram.jpg)

### **Opis przebiegu rejestracji użytkownika**

1. **Użytkownik wprowadza dane:**  
   Użytkownik wypełnia formularz rejestracji, podając swoje dane, takie jak imię, nazwisko, e-mail i hasło.

2. **Przesłanie żądania:**  
   Dane są przesyłane za pomocą żądania `POST /auth/register` do kontrolera `AuthController`.

3. **Walidacja danych:**  
   `AuthController` sprawdza poprawność wprowadzonych danych. Weryfikuje, czy:

   - Wszystkie pola są poprawnie wypełnione.
   - Podany e-mail nie istnieje już w systemie.

4. **Szyfrowanie hasła:**  
   Jeśli dane są poprawne, hasło użytkownika jest szyfrowane przy użyciu `PasswordEncoder`, który jest dostarczany przez Spring Security. Szyfrowanie hasła zapewnia, że nawet jeśli dane zostaną przechwycone lub baza danych zostanie naruszona, hasła użytkowników pozostaną bezpieczne.

5. **Zapis w bazie danych:**  
   Tworzony jest nowy obiekt użytkownika, który następnie zostaje zapisany w bazie danych przy użyciu `UserRepository`.

6. **Odpowiedź do użytkownika:**  
   Po pomyślnym zapisaniu danych serwer zwraca odpowiedź potwierdzającą rejestrację. W przypadku błędu (np. istniejącego e-maila), użytkownik otrzymuje odpowiednią wiadomość zwrotną.

---

### **Opis przebiegu logowania użytkownika**

1. **Użytkownik wprowadza dane:**  
   Użytkownik wypełnia formularz logowania, podając swoje dane uwierzytelniające, takie jak e-mail i hasło.

2. **Przesłanie żądania:**  
   Dane są przesyłane za pomocą żądania `POST /auth/login` do kontrolera `AuthController`.

3. **Walidacja danych:**  
   `AuthController` przekazuje dane do `AuthenticationManager`, który jest konfigurowany w ramach Spring Security. `AuthenticationManager`:

   - Korzysta z `CustomUserDetailsService` do ładowania szczegółów użytkownika z bazy danych.
   - Sprawdza, czy użytkownik z podanym e-mailem istnieje.
   - Porównuje zaszyfrowane hasło wprowadzone przez użytkownika z hasłem przechowywanym w bazie danych przy użyciu mechanizmu Spring Security.

4. **Uwierzytelnienie:**  
   Jeśli dane logowania są poprawne, użytkownik zostaje uwierzytelniony i Spring Security tworzy dla niego sesję.

5. **Odpowiedź do użytkownika:**
   Po pomyślnym uwierzytelnieniu serwer zwraca odpowiedź potwierdzającą logowanie. W przypadku błędu (np. błędne hasło lub e-mail), użytkownik otrzymuje komunikat zwrotny.

---

### **Rola Spring Security w procesach rejestracji i logowania**

- **Szyfrowanie haseł:** Dzięki `PasswordEncoder` hasła są przechowywane w bezpieczny sposób.
- **Walidacja danych uwierzytelniających:** `AuthenticationManager` i `CustomUserDetailsService` umożliwiają weryfikację użytkowników i ich haseł.
- **Ochrona punktów końcowych:** Spring Security zapewnia kontrolę dostępu do endpointów, umożliwiając dostęp do wybranych zasobów tylko po zalogowaniu.
- **Bezpieczeństwo aplikacji:** Oferuje gotowe mechanizmy ochrony przed popularnymi atakami, takimi jak CSRF czy brute force.

---
