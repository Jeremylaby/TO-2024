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
`DELETE /user`

**Opis:**  
Usuwa istniejącego użytkownika z systemu na podstawie adresu e-mail.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ    | Walidacja                                 | Opis                      |
| ---------- | ------ | ----------------------------------------- | ------------------------- | --- |
| `email`    | String | Email przypisany użytkownikowi, Nie pusty | Adres e-mail użytkownika. |     |

**Odpowiedź:**

- **Status 200 OK:** Użytkownik został usunięty z systemu. Zwracane są dane usuniętego użytkownika.  
  Przykład odpowiedzi:

  ```json
  {
    "id": 1,
    "firstName": "Adam",
    "lastName": "Nowak",
    "email": "adam.nowak@example.com",
    "password": "encodedPasswordHere"
  }
  ```

- **Status 404 Not Found:** Użytkownik o podanym adresie e-mail nie istnieje w systemie.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "User with email adam.nowak@example.com not found."
  }
  ```
