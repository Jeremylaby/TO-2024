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

### `ReservationController`

`ReservationController` obsługuje rezerwacje w systemie Multiplex. Oferuje punkty końcowe do tworzenia, usuwania, aktualizacji oraz pobierania informacji o rezerwacjach, zwracając dane w formacie `ReservationDTO`. Wspiera również mechanizm harmonogramowania, który automatycznie usuwa nieopłacone rezerwacje.

---

#### **Dodanie rezerwacji**

**Endpoint:**  
`POST /api/reservation/add`

**Opis:**  
Tworzy nową rezerwację na wybrane miejsca w ramach określonego seansu.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ        | Walidacja     | Opis                                            |
| ---------- | ---------- | ------------- | ----------------------------------------------- |
| `seansId`  | Long       | Istniejący ID | ID seansu, na który dokonywana jest rezerwacja. |
| `userId`   | Long       | Istniejący ID | ID użytkownika, który rezerwuje miejsca.        |
| `seats`    | List<Long> | Nie puste     | Lista ID miejsc.                                |

**Odpowiedź:**

- **Status 200 OK:** Rezerwacja została pomyślnie dodana.  
  Przykład odpowiedzi:

  ```json
  {
    "message": "Reservation added successfully!"
  }
  ```

- **Status 400 Bad Request:** Niektóre miejsca nie istnieją lub nie pasują do pokoju seansu.  
  Przykład odpowiedzi:

  ```json
  {
    "error": "Some seats are missing"
  }
  ```

- **Status 409 Conflict:** Przynajmniej jedno z wybranych miejsc jest już zajęte.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "Seat already taken {...}"
  }
  ```

---

#### **Pobranie rezerwacji po ID**

**Endpoint:**  
`GET /api/reservation/{id}`

**Opis:**  
Zwraca szczegóły rezerwacji na podstawie jej ID.

**Odpowiedź:**

- **Status 200 OK:** Rezerwacja została znaleziona.  
  Przykład odpowiedzi:

  ```json
  {
    "id": 1,
    "paid": false,
    "user": {...},
    "seat": {...},
    "seans": {...},
    "price": 45.00
  }
  ```

- **Status 400 Bad Request:** Rezerwacja o podanym ID nie istnieje.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "There is not such reservation"
  }
  ```

---

#### **Usunięcie rezerwacji**

**Endpoint:**  
`DELETE /api/reservation/{id}/delete`

**Opis:**  
Usuwa istniejącą rezerwację na podstawie jej ID.

**Odpowiedź:**

- **Status 200 OK:** Rezerwacja została pomyślnie usunięta.  
  Przykład odpowiedzi:

  ```json
  {
    "message": "Reservation deleted successfully!"
  }
  ```

- **Status 400 Bad Request:** Rezerwacja o podanym ID nie istnieje.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "There is not such reservation"
  }
  ```

---

#### **Opłacenie rezerwacji**

**Endpoint:**  
`PUT /api/reservation/{id}/pay`

**Opis:**  
Ustawia status rezerwacji na opłaconą.

**Odpowiedź:**

- **Status 200 OK:** Rezerwacja została pomyślnie opłacona.  
  Przykład odpowiedzi:

  ```json
  {
    "message": "Reservation paid successfully!"
  }
  ```

- **Status 400 Bad Request:** Rezerwacja o podanym ID nie istnieje lub została już opłacona.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "Reservation already paid"
  }
  ```

---

#### **Pobranie rezerwacji użytkownika**

**Endpoint:**  
`GET /user/{id}`

**Opis:**  
Zwraca listę rezerwacji dla danego użytkownika na podstawie jego ID.

**Parametry:**

| Nazwa parametru | Typ  | Walidacja | Opis                                |
| --------------- | ---- | --------- | ----------------------------------- |
| `id`            | Long | Nie puste | Unikalny identyfikator użytkownika. |

**Odpowiedź:**

- **Status 200 OK:** Lista rezerwacji w formacie `ReservationDTO`.  
  Przykład odpowiedzi:
  ```json
  [
    {
      "id": 1,
      "paid": true,
      "userId": 1001,
      "firstName": "John",
      "lastName": "Doe",
      "row": 5,
      "seatNumber": 10,
      "roomName": "Room A",
      "price": 20.5,
      "start": "2025-01-01T18:00:00",
      "endTime": "2025-01-01T20:00:00",
      "movie": {
        "id": 101,
        "title": "Inception",
        "director": "Christopher Nolan",
        "duration": 148,
        "genres": ["Sci-Fi", "Thriller"]
      }
    }
  ]
  ```

---

#### **Pobranie wszystkich rezerwacji**

**Endpoint:**  
`GET /all`

**Opis:**  
Zwraca listę wszystkich rezerwacji w systemie w formacie `ReservationDTO`.

**Odpowiedź:**

- **Status 200 OK:** Lista wszystkich rezerwacji.  
  Przykład odpowiedzi:
  ```json
  [
    {
      "id": 1,
      "paid": true,
      "userId": 1001,
      "firstName": "John",
      "lastName": "Doe",
      "row": 5,
      "seatNumber": 10,
      "roomName": "Room A",
      "price": 20.5,
      "start": "2025-01-01T18:00:00",
      "endTime": "2025-01-01T20:00:00",
      "movie": {
        "id": 101,
        "title": "Inception",
        "director": "Christopher Nolan",
        "duration": 148,
        "genres": ["Sci-Fi", "Thriller"]
      }
    }
  ]
  ```

---

#### **Pobranie dzisiejszych rezerwacji**

**Endpoint:**  
`GET /all/today`

**Opis:**  
Zwraca listę rezerwacji złożonych na dzisiejsze seanse.

**Odpowiedź:**

- **Status 200 OK:** Lista dzisiejszych rezerwacji w formacie `ReservationDTO`.  
  Przykład odpowiedzi:
  ```json
  [
    {
      "id": 2,
      "paid": false,
      "userId": 1002,
      "firstName": "Alice",
      "lastName": "Smith",
      "row": 3,
      "seatNumber": 8,
      "roomName": "Room B",
      "price": 15.0,
      "start": "2025-01-01T15:00:00",
      "endTime": "2025-01-01T17:00:00",
      "movie": {
        "id": 102,
        "title": "Interstellar",
        "director": "Christopher Nolan",
        "duration": 169,
        "genres": ["Sci-Fi", "Drama"]
      }
    }
  ]
  ```

---

#### **Pobranie rezerwacji w zakresie czasowym**

**Endpoint:**  
`GET /all/time-range`

**Opis:**  
Zwraca listę rezerwacji w podanym zakresie czasowym.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ       | Walidacja | Opis                        |
| ---------- | --------- | --------- | --------------------------- |
| `start`    | Timestamp | Nie puste | Początek zakresu czasowego. |
| `end`      | Timestamp | Nie puste | Koniec zakresu czasowego.   |

**Odpowiedź:**

- **Status 200 OK:** Lista rezerwacji w podanym zakresie czasowym w formacie `ReservationDTO`.  
  Przykład odpowiedzi:
  ```json
  [
    {
      "id": 3,
      "paid": true,
      "userId": 1003,
      "firstName": "Bob",
      "lastName": "Johnson",
      "row": 2,
      "seatNumber": 12,
      "roomName": "Room C",
      "price": 18.0,
      "start": "2025-01-01T10:00:00",
      "endTime": "2025-01-01T12:00:00",
      "movie": {
        "id": 103,
        "title": "The Dark Knight",
        "director": "Christopher Nolan",
        "duration": 152,
        "genres": ["Action", "Crime"]
      }
    }
  ]
  ```

---

### Wyjaśnienie

- **Zmiana odpowiedzi na `ReservationDTO`**:
  Wszystkie endpointy zwracają teraz DTO, co zapewnia lepszą enkapsulację danych i eliminuje niepotrzebne szczegóły.
- **Przykłady odpowiedzi**:
  Każda odpowiedź jest dostosowana do struktury `ReservationDTO`.

### **Automatyczne usuwanie nieopłaconych rezerwacji**

#### **Endpoint:**

Brak bezpośredniego punktu końcowego – proces wykonywany w tle jako zadanie cykliczne za pomocą harmonogramu.

---

#### **Opis:**

Zadanie harmonogramowane weryfikuje wszystkie nieopłacone rezerwacje, których seanse zaczynają się w ciągu godziny. Jeśli rezerwacja nie jest opłacona, zostaje automatycznie usunięta z systemu.

---

#### **Mechanizm działania:**

1. **Interwał wykonania:**  
   Zadanie wykonywane jest cyklicznie co 15 minut (zgodnie z wartością stałej `FIXED_RATE = 900000L`, co oznacza 15 minut w milisekundach).

2. **Kroki operacji:**
   - Pobranie aktualnego czasu.
   - Obliczenie czasu docelowego jako godzina od aktualnego momentu.
   - Pobranie listy nieopłaconych rezerwacji, których czas seansu przypada przed tym czasem docelowym.
   - Usunięcie każdej z tych rezerwacji z systemu za pomocą metody `reservationService.removeReservation()`.

---

#### **Kod logiki:**

```java
@Scheduled(fixedRate = FIXED_RATE)
public void removeUnpaidReservations() {
    Timestamp time = Timestamp.valueOf(LocalDateTime.now().plusHours(1)); // Określenie granicy czasowej
    List<Reservation> reservations = reservationService.getUnpaidReservationsBefore(time); // Pobranie rezerwacji
    for (Reservation reservation : reservations) {
        reservationService.removeReservation(reservation); // Usunięcie każdej nieopłaconej rezerwacji
    }
}
```

---

#### **Przykład działania:**

**Założenia:**

- Obecny czas: **2025-01-01T14:30:00**.
- Rezerwacje w systemie:
  ```json
  [
    {
      "id": 1,
      "paid": false,
      "seans": {
        "start": "2025-01-01T15:00:00"
      }
    },
    {
      "id": 2,
      "paid": true,
      "seans": {
        "start": "2025-01-01T15:30:00"
      }
    },
    {
      "id": 3,
      "paid": false,
      "seans": {
        "start": "2025-01-01T16:00:00"
      }
    }
  ]
  ```

**Wynik działania:**

1. Zadanie sprawdza rezerwacje, których czas rozpoczęcia jest mniejszy niż **2025-01-01T15:30:00** (obecny czas + 1 godzina).
2. Rezerwacja o `id = 1` zostanie usunięta, ponieważ:
   - Jest nieopłacona.
   - Jej czas rozpoczęcia mieści się w określonym przedziale.
3. Rezerwacje `id = 2` i `id = 3` pozostają w systemie.

---

### **SeansController**

`SeansController` zajmuje się zarządzaniem seansami w systemie Multiplex. Umożliwia dodawanie nowych seansów, usuwanie istniejących, a także pobieranie listy seansów w zależności od określonych kryteriów, takich jak przedział czasowy, sala czy film.

---

#### **Dodanie nowego seansu**

**Endpoint:**  
`POST /api/seans/add`

**Opis:**  
Tworzy nowy seans na podstawie przesłanych danych. Sprawdza, czy sala jest dostępna w wybranym przedziale czasowym.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ        | Walidacja        | Opis                                   |
| ---------- | ---------- | ---------------- | -------------------------------------- |
| `movieId`  | Long       | Istniejący ID    | ID filmu, który ma zostać wyświetlony. |
| `roomId`   | Long       | Istniejący ID    | ID sali, w której ma odbyć się seans.  |
| `start`    | Timestamp  | Nie puste        | Data i godzina rozpoczęcia seansu.     |
| `price`    | BigDecimal | Wartość dodatnia | Cena biletu na seans.                  |

**Odpowiedź:**

- **Status 200 OK:** Seans został pomyślnie dodany.  
  Przykład odpowiedzi:

  ```json
  {
    "message": "Seans added successful!"
  }
  ```

- **Status 400 Bad Request:** Film lub sala nie istnieją.  
  Przykład odpowiedzi:

  ```json
  {
    "error": "There is not such movie"
  }
  ```

- **Status 409 Conflict:** Sala jest zajęta w określonym przedziale czasowym.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "Room is not available in that time range"
  }
  ```

---

#### **Usunięcie seansu**

**Endpoint:**  
`DELETE /api/seans/{id}`

**Opis:**  
Usuwa seans z systemu na podstawie jego ID.

**Odpowiedź:**

- **Status 200 OK:** Seans został pomyślnie usunięty.

---

#### **Pobranie wszystkich seansów**

**Endpoint:**  
`GET /api/seans/all`

**Opis:**  
Zwraca listę wszystkich seansów dostępnych w systemie.

**Odpowiedź:**

- **Status 200 OK:** Lista wszystkich seansów.  
  Przykład odpowiedzi:
  ```json
  [
    {
      "id": 1,
      "start": "2025-01-01T10:00:00",
      "endTime": "2025-01-01T12:30:00",
      "movie": {...},
      "room": {...},
      "price": 45.00
    },
    {...}
  ]
  ```

---

#### **Pobranie seansów w przedziale czasowym**

**Endpoint:**  
`GET /api/seans/all/between-dates`

**Opis:**  
Zwraca listę seansów odbywających się w określonym przedziale czasowym.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ       | Walidacja | Opis             |
| ---------- | --------- | --------- | ---------------- |
| `start`    | Timestamp | Nie puste | Data początkowa. |
| `end`      | Timestamp | Nie puste | Data końcowa.    |

**Odpowiedź:**

- **Status 200 OK:** Lista seansów w określonym przedziale czasowym.  
  Przykład odpowiedzi:
  ```json
  [
    {
      "id": 1,
      "start": "2025-01-01T10:00:00",
      "endTime": "2025-01-01T12:30:00",
      "movie": {...},
      "room": {...},
      "price": 45.00
    },
    {...}
  ]
  ```

---

#### **Pobranie seansów w przedziale czasowym w konkretnej sali**

**Endpoint:**  
`GET /api/seans/all/between-dates-room`

**Opis:**  
Zwraca listę seansów odbywających się w określonym przedziale czasowym w wybranej sali.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ       | Walidacja     | Opis             |
| ---------- | --------- | ------------- | ---------------- |
| `start`    | Timestamp | Nie puste     | Data początkowa. |
| `end`      | Timestamp | Nie puste     | Data końcowa.    |
| `roomId`   | Long      | Istniejący ID | ID sali.         |

**Odpowiedź:**

- **Status 200 OK:** Lista seansów w określonym przedziale czasowym w wybranej sali.  
  Przykład odpowiedzi:
  ```json
  [
    {
      "id": 1,
      "start": "2025-01-01T10:00:00",
      "endTime": "2025-01-01T12:30:00",
      "movie": {...},
      "room": {...},
      "price": 45.00
    },
    {...}
  ]
  ```

---

#### **Pobranie seansów w przedziale czasowym dla konkretnego filmu**

**Endpoint:**  
`GET /api/seans/all/between-dates-movie`

**Opis:**  
Zwraca listę seansów odbywających się w określonym przedziale czasowym dla wybranego filmu.

**Treść żądania (`Request Body`):**

| Nazwa pola | Typ       | Walidacja     | Opis             |
| ---------- | --------- | ------------- | ---------------- |
| `start`    | Timestamp | Nie puste     | Data początkowa. |
| `end`      | Timestamp | Nie puste     | Data końcowa.    |
| `movieId`  | Long      | Istniejący ID | ID filmu.        |

**Odpowiedź:**

- **Status 200 OK:** Lista seansów w określonym przedziale czasowym dla wybranego filmu.  
  Przykład odpowiedzi:
  ```json
  [
    {
      "id": 1,
      "start": "2025-01-01T10:00:00",
      "endTime": "2025-01-01T12:30:00",
      "movie": {...},
      "room": {...},
      "price": 45.00
    },
    {...}
  ]
  ```

---

#### **Pobranie szczegółów seansu**

**Endpoint:**  
`GET /seans/{id}`

**Opis:**  
Zwraca szczegóły seansu na podstawie jego ID.

**Parametry:**  

| Nazwa parametru | Typ  | Walidacja | Opis                                |
| --------------- | ---- | --------- | ----------------------------------- |
| `id`            | Long | Nie puste | Unikalny identyfikator seansu.      |

**Odpowiedź:**  

- **Status 200 OK:** Szczegóły seansu.  
  Przykład odpowiedzi:  
  ```json
  {
    "id": 1,
    "movieId": 101,
    "startTime": "2025-01-02T14:00:00",
    "endTime": "2025-01-02T16:30:00",
    "roomName": "Room A",
    "movie": {
      "id": 101,
      "title": "Inception",
      "duration": 148,
      "genres": ["Sci-Fi", "Thriller"]
    }
  }
  ```

- **Status 404 Not Found:** Seans o podanym ID nie istnieje.
 
  Przykład odpowiedzi:
  ```json
  {
    "error": "There is not such seanse"
  }
  ```
---

#### **Pobranie listy filmów obecnie granych**

**Endpoint:**  
`GET /seans/currently-playing`

**Opis:**  
Zwraca listę filmów, które są obecnie grane w kinie.

**Odpowiedź:**  

- **Status 200 OK:** Lista filmów obecnie granych.  
  Przykład odpowiedzi:  
  ```json
  [
    {
      "id": 101,
      "title": "Inception",
      "duration": 148,
      "genres": ["Sci-Fi", "Thriller"]
    },
    {
      "id": 102,
      "title": "The Dark Knight",
      "duration": 152,
      "genres": ["Action", "Drama"]
    }
  ]
  ```
---

#### **Pobranie listy wolnych miejsc na seans**

**Endpoint:**  
`GET /seans/{id}/seats`

**Opis:**  
Zwraca listę wolnych miejsc na wybrany seans.

**Parametry:**  

| Nazwa parametru | Typ  | Walidacja | Opis                                |
| --------------- | ---- | --------- | ----------------------------------- |
| `id`            | Long | Nie puste | Unikalny identyfikator seansu.      |

**Odpowiedź:**  

- **Status 200 OK:** Lista wolnych miejsc na seans.  
  Przykład odpowiedzi:  
  ```json
  [
    {
      "id": 1,
      "row": 5,
      "seatNumber": 10
    },
    {
      "id": 2,
      "row": 5,
      "seatNumber": 11
    }
  ]
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

#### **Pobranie listy seansów dla filmu**

**Endpoint:**  
`GET /movie/seanses/{id}`

**Opis:**  
Zwraca listę wszystkich seansów powiązanych z filmem o określonym ID.

**Parametry:**  

| Nazwa parametru | Typ  | Walidacja | Opis                                |
| --------------- | ---- | --------- | ----------------------------------- |
| `id`            | Long | Nie puste | Unikalny identyfikator filmu.       |

**Odpowiedź:**  

- **Status 200 OK:** Lista seansów dla filmu.  
  Przykład odpowiedzi:  
  ```json
  [
    {
      "id": 1,
      "movieId": 101,
      "startTime": "2025-01-02T14:00:00",
      "endTime": "2025-01-02T16:30:00",
      "roomName": "Room A"
    },
    {
      "id": 2,
      "movieId": 101,
      "startTime": "2025-01-02T18:00:00",
      "endTime": "2025-01-02T20:30:00",
      "roomName": "Room B"
    }
  ]

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

### `SeatController`

`SeatController` zarządza operacjami związanymi z miejscami w salach kinowych systemu Multiplex. Oferuje główny punkt końcowy do dodawania miejsc do sal.

#### **Dodawanie miejsca do sali**

**Endpoint:**  
`POST /seat/add`

**Opis:**  
Dodaje nowe miejsce do istniejącej sali w systemie.

**Treść żądania (`Request Body`):**
| Nazwa pola | Typ | Walidacja | Opis |
| ------------- | ------ | ----------------------------------------------- | -------------------------- |
| `roomName` | String | Nazwa istniejącej sali, Nie puste | Nazwa sali kinowej. |
| `row` | Integer| Nie puste | Rząd, w którym znajduje się miejsce. |
| `seatNumber` | Integer| Nie puste | Numer miejsca. |

**Odpowiedź:**

- **Status 200 OK:** Miejsce dodane pomyślnie.  
  Przykład odpowiedzi:

  ```json
  {
    "message": "Seat added successfully!"
  }
  ```

- **Status 404 Not Found:** Nie znaleziono sali o podanej nazwie.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "Room with provided name could not be found."
  }
  ```
- **Status 409 Conflict:** Miejsce o podanym numerze i rzędzie już istnieje w sali.  
  Przykład odpowiedzi:
  ```json
  {
    "error": "Seat already exists."
  }
  ```

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
