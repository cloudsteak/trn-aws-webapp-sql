# AWS WebApp SQL hozzáféréssel

## Összetevők

- AWS Elastic Beanstalk
- AWS RDS (MariaDB)

## SQL adatbázis létrehozása

1. Lépjünk be az AWS konzolba
2. Keresőbe írjuk be a RDS szolgáltatást
3. Kattintsunk a "Create database" gombra
4. Válasszuk ki a Mariadb adatbázist
5. Válasszuk ki a "Free tier" opciót
6. Töltsük ki a következő oldalon a kötelező mezőket
   - DB instance identifier: adatbazis
   - Master username: adatgazda
   - Jelszónál (Master password) generáljunk valami erős jelszót [itt](https://delinea.com/resources/password-generator-it-tool). (Pl.: `FA+Hb#Tb8dLsUdac8UVesY*8`)
7. Kattintsunk a "Create database" gombra
8. Miután létrejött az adatbázis, kattintsunk rá, majd kattintsunk a "Modify" gombra
9. A "Public accessibility" opciót állítsuk "Yes" (Connectivity > Additional configuration)
10. Kattintsunk a "Continue" gombra
11. Kattintsunk a "Apply immediately" gombra
12. Kattintsunk a "Modify DB instance" gombra
13. Várd meg, amíg a módosítás végrehajtódik

## Kapcsoldás az adatbázishoz

Többféle programot hasznélhatunk az adatbázis kezelésére, de most a Beekeeper-t fogjuk használni. Innen tudod letölteni: [Beekeeper](https://www.beekeeperstudio.io/)

1. Telepítsd a Beekeeper-t
2. Nyisd meg a programot
3. Kattints a "New Connection" gombra
4. Kapcsolat típusa: MariaDB
5. Töltsd ki a következő mezőket:
   - Connection name: AWS RDS
   - Hostname: az RDS adatbázisunk endpoint-je (ezt megtalálod az RDS konzolban)
   - Port: 3306
   - Username: adatgazda
   - Password: a korábban generált jelszó
6. Kattints a "Test" gombra, hogy ellenőrizd a kapcsolatot
7. Ha minden rendben van, kattints a "Save" gombra
8. Csatlakozz az adatbázishoz

## Adatbázis létrehozása

1. Nyiss egy új lekérzező (Query) fület
2. Futtasd le a következő SQL parancsot:

```sql
CREATE DATABASE cikkek
CHARACTER SET utf8
COLLATE utf8_hungarian_ci;

USE cikkek;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
);
```

## Alkalmazás helyi futtatása

1. Klónozd le a projektet
2. Telepítsd a szükséges csomagokat: `npm install`
3. Hozz létre egy `.env` fájlt a projekt gyökérkönyvtárában a következő tartalommal:

```
# .env file
DB_USER="admin"
DB_PASSWORD={RDS jelszava}
DB_SERVER={RDS endpoint}
DB_NAME="cikkek"
DB_PORT="3306"
```

4. Indítsd el az alkalmazást: `npm start`
5. Nyisd meg a böngészőt, és látogasd meg a `http://localhost:8080` címet


## Alkalmazás futtatása Elastic Beanstalk segítségével

1. Lépjünk be az AWS konzolba
2. Keresőbe írjuk be az Elastic Beanstalk szolgáltatást
3. Kattintsunk a "Create environment" gombra
4. Töltsük ki a kötelező mezőket
   - Application name: cikkek
   - Environment name: cikkek-env
   - Domain (opcionális): cikkek
   - Platform: Node.js
   - Platform branch: Node.js 20
   - Application code: Sample application
   - Presets: Single instance
5. Kattintsunk a "Next" gombra
6. Create and use new service role
    - Service role name: cikkek-role
7. EC2 key pair: Create new key pair
    - Key pair name: cikkek-key
8. Kattintsunk a "Next" gombra
9. Kattintsunk a "Skip to review" gombra
10. Kattintsunk a "Submit" gombra

Ha létrejött a példa alkalmazás, CodePipeline segítségével töltsd fel a saját alkalmazásodat.

1. Keresőbe írjuk be a CodePipeline szolgáltatást
2. Kattintsunk a "Create pipeline" gombra
