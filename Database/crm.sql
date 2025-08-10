IF DB_ID('CRM_DB') IS NOT NULL
BEGIN
    ALTER DATABASE CRM_DB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CRM_DB;
END;

CREATE DATABASE CRM_DB;

USE CRM_DB;

CREATE TABLE Users (
    user_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL CHECK (role IN ('admin', 'agent', 'manager')),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    deleted_at DATETIME2 NULL
);

CREATE TABLE Customers (
    customer_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    phone NVARCHAR(20) NOT NULL,
    address NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    deleted_at DATETIME2 NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Interactions (
    interaction_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    interaction_type NVARCHAR(20) NOT NULL CHECK (interaction_type IN ('call', 'email', 'meeting', 'follow_up')),
    notes NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    deleted_at DATETIME2 NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Sales (
    sale_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    product NVARCHAR(255) NOT NULL,
    amount DECIMAL(8, 2) NOT NULL,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('pending', 'closed', 'cancelled', 'refunded')),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    deleted_at DATETIME2 NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Notifications (
    notification_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('unread', 'read', 'archived')),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    deleted_at DATETIME2 NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Reports (
    report_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    report_type NVARCHAR(30) NOT NULL CHECK (report_type IN ('performance', 'sales', 'interactions')),
    filters_used NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    deleted_at DATETIME2 NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);



SELECT cc.name
FROM sys.check_constraints cc
JOIN sys.columns c ON cc.parent_object_id = c.object_id
WHERE cc.parent_object_id = OBJECT_ID('Users') AND c.name = 'role';


ALTER TABLE Users
ADD CONSTRAINT CK_Users_Role CHECK (role IN ('admin', 'sales', 'consumer'));


CREATE TRIGGER trg_CreateCustomerAfterUserInsert
ON Users
AFTER INSERT
AS
BEGIN
    INSERT INTO Customers (name, email, created_at, user_id, phone, address)
    SELECT 
        name,
        email,
        GETDATE(),
        user_id,
        '',  -- empty string as placeholder for phone
        ''   -- empty string as placeholder for address
    FROM inserted
    WHERE role = 'consumer';
END;

select * from users

select * from Customers

ALTER TABLE Customers
DROP CONSTRAINT FK__Customers__user___5070F446;

ALTER TABLE Customers
ADD CONSTRAINT FK__Customers__user___5070F446
FOREIGN KEY (user_id) REFERENCES Users(user_id)
ON DELETE CASCADE;


INSERT INTO users (name, email, password, role) VALUES
('Alice Morgan', 'alice.morgan1@example.com', '123456', 'Admin'),
('Brian Smith', 'brian.smith2@example.com', '123456', 'Admin'),
('Catherine Lane', 'catherine.lane3@example.com', '123456', 'Admin'),
('David Young', 'david.young4@example.com', '123456', 'Admin'),
('Eva Johnson', 'eva.johnson5@example.com', '123456', 'Admin'),
('Frank Turner', 'frank.turner6@example.com', '123456', 'Admin'),
('Grace Lee', 'grace.lee7@example.com', '123456', 'Admin'),
('Henry Kim', 'henry.kim8@example.com', '123456', 'Admin'),
('Isabella Gray', 'isabella.gray9@example.com', '123456', 'Admin'),
('Jack White', 'jack.white10@example.com', '123456', 'Admin'),
('Karen Brown', 'karen.brown11@example.com', '123456', 'Admin'),
('Leo Walker', 'leo.walker12@example.com', '123456', 'Admin'),
('Mona Davis', 'mona.davis13@example.com', '123456', 'Admin'),
('Nathan Harris', 'nathan.harris14@example.com', '123456', 'Admin'),
('Olivia Scott', 'olivia.scott15@example.com', '123456', 'Admin'),
('Peter Adams', 'peter.adams16@example.com', '123456', 'Admin'),
('Queenie Foster', 'queenie.foster17@example.com', '123456', 'Admin'),
('Ronald Hill', 'ronald.hill18@example.com', '123456', 'Admin'),
('Sophia Clark', 'sophia.clark19@example.com', '123456', 'Admin'),
('Thomas Lewis', 'thomas.lewis20@example.com', '123456', 'Admin');


INSERT INTO users (name, email, password, role) VALUES
('Ursula Bennett', 'ursula.bennett21@example.com', '123456', 'Admin'),
('Victor Ross', 'victor.ross22@example.com', '123456', 'Admin'),
('Wendy James', 'wendy.james23@example.com', '123456', 'Admin'),
('Xavier Mitchell', 'xavier.mitchell24@example.com', '123456', 'Admin'),
('Yvonne Price', 'yvonne.price25@example.com', '123456', 'Admin'),
('Zack Morgan', 'zack.morgan26@example.com', '123456', 'Admin'),
('Amanda Steele', 'amanda.steele27@example.com', '123456', 'Admin'),
('Ben Carter', 'ben.carter28@example.com', '123456', 'Admin'),
('Chloe Grant', 'chloe.grant29@example.com', '123456', 'Admin'),
('Dylan Reed', 'dylan.reed30@example.com', '123456', 'Admin'),
('Ella Hayes', 'ella.hayes31@example.com', '123456', 'Admin'),
('Felix Ray', 'felix.ray32@example.com', '123456', 'Admin'),
('Gina Payne', 'gina.payne33@example.com', '123456', 'Admin'),
('Harry Bishop', 'harry.bishop34@example.com', '123456', 'Admin'),
('Ivy Howell', 'ivy.howell35@example.com', '123456', 'Admin'),
('Jake Webb', 'jake.webb36@example.com', '123456', 'Admin'),
('Kylie Moss', 'kylie.moss37@example.com', '123456', 'Admin'),
('Liam Newton', 'liam.newton38@example.com', '123456', 'Admin'),
('Maya Lane', 'maya.lane39@example.com', '123456', 'Admin'),
('Noah Blake', 'noah.blake40@example.com', '123456', 'Admin'),
('Olga Dean', 'olga.dean41@example.com', '123456', 'Sales'),
('Paul Watts', 'paul.watts42@example.com', '123456', 'Sales'),
('Quinn Abbott', 'quinn.abbott43@example.com', '123456', 'Sales'),
('Rachel Boone', 'rachel.boone44@example.com', '123456', 'Sales'),
('Sam Jordan', 'sam.jordan45@example.com', '123456', 'Sales'),
('Tina Burke', 'tina.burke46@example.com', '123456', 'Sales'),
('Umar Nixon', 'umar.nixon47@example.com', '123456', 'Sales'),
('Vera Lane', 'vera.lane48@example.com', '123456', 'Sales'),
('Will Cox', 'will.cox49@example.com', '123456', 'Sales'),
('Xena Doyle', 'xena.doyle50@example.com', '123456', 'Sales'),
('Yash Moore', 'yash.moore51@example.com', '123456', 'Sales'),
('Zara Tate', 'zara.tate52@example.com', '123456', 'Sales'),
('Adam Flynn', 'adam.flynn53@example.com', '123456', 'Sales'),
('Bella Knight', 'bella.knight54@example.com', '123456', 'Sales'),
('Carl Norton', 'carl.norton55@example.com', '123456', 'Sales'),
('Dana Frost', 'dana.frost56@example.com', '123456', 'Sales'),
('Ethan Sharp', 'ethan.sharp57@example.com', '123456', 'Sales'),
('Faith Kemp', 'faith.kemp58@example.com', '123456', 'Sales'),
('George York', 'george.york59@example.com', '123456', 'Sales'),
('Holly Page', 'holly.page60@example.com', '123456', 'Sales'),
('Ian Burke', 'ian.burke61@example.com', '123456', 'Sales'),
('Julia Bates', 'julia.bates62@example.com', '123456', 'Sales'),
('Kyle Watts', 'kyle.watts63@example.com', '123456', 'Sales'),
('Laura Marsh', 'laura.marsh64@example.com', '123456', 'Sales'),
('Marcus Pope', 'marcus.pope65@example.com', '123456', 'Sales'),
('Nina Webb', 'nina.webb66@example.com', '123456', 'Sales'),
('Oscar Neal', 'oscar.neal67@example.com', '123456', 'Sales'),
('Penny Holt', 'penny.holt68@example.com', '123456', 'Sales'),
('Quincy Rhodes', 'quincy.rhodes69@example.com', '123456', 'Sales'),
('Rita Vaughn', 'rita.vaughn70@example.com', '123456', 'Sales'),
('Stan Willis', 'stan.willis71@example.com', '123456', 'Sales'),
('Tara Benson', 'tara.benson72@example.com', '123456', 'Sales'),
('Ulysses Bruce', 'ulysses.bruce73@example.com', '123456', 'Sales'),
('Violet Green', 'violet.green74@example.com', '123456', 'Sales'),
('Walt Ray', 'walt.ray75@example.com', '123456', 'Sales'),
('Ximena Ford', 'ximena.ford76@example.com', '123456', 'Sales'),
('Yuri Grant', 'yuri.grant77@example.com', '123456', 'Sales'),
('Zane Gray', 'zane.gray78@example.com', '123456', 'Sales'),
('Amber Wolfe', 'amber.wolfe79@example.com', '123456', 'Sales'),
('Blake Hunt', 'blake.hunt80@example.com', '123456', 'Sales'),
('Cara Nash', 'cara.nash81@example.com', '123456', 'Consumer'),
('Derek Hale', 'derek.hale82@example.com', '123456', 'Consumer'),
('Elsa Dean', 'elsa.dean83@example.com', '123456', 'Consumer'),
('Finn Paul', 'finn.paul84@example.com', '123456', 'Consumer'),
('Gwen Rose', 'gwen.rose85@example.com', '123456', 'Consumer'),
('Harvey King', 'harvey.king86@example.com', '123456', 'Consumer'),
('Isla Reed', 'isla.reed87@example.com', '123456', 'Consumer'),
('Jayden Lowe', 'jayden.lowe88@example.com', '123456', 'Consumer'),
('Kara Wolfe', 'kara.wolfe89@example.com', '123456', 'Consumer'),
('Lance Kerr', 'lance.kerr90@example.com', '123456', 'Consumer'),
('Mira Fox', 'mira.fox91@example.com', '123456', 'Consumer'),
('Nolan Drew', 'nolan.drew92@example.com', '123456', 'Consumer'),
('Opal Stone', 'opal.stone93@example.com', '123456', 'Consumer'),
('Parker Hale', 'parker.hale94@example.com', '123456', 'Consumer'),
('Quella Cross', 'quella.cross95@example.com', '123456', 'Consumer'),
('Ralph Nash', 'ralph.nash96@example.com', '123456', 'Consumer'),
('Stella Ray', 'stella.ray97@example.com', '123456', 'Consumer'),
('Trent Long', 'trent.long98@example.com', '123456', 'Consumer'),
('Una Miles', 'una.miles99@example.com', '123456', 'Consumer'),
('Victor Cain', 'victor.cain100@example.com', '123456', 'Consumer'),
('Willa Lane', 'willa.lane101@example.com', '123456', 'Consumer'),
('Xander Cole', 'xander.cole102@example.com', '123456', 'Consumer'),
('Yasmine Hart', 'yasmine.hart103@example.com', '123456', 'Consumer'),
('Zion Hunt', 'zion.hunt104@example.com', '123456', 'Consumer'),
('Alina Craig', 'alina.craig105@example.com', '123456', 'Consumer'),
('Brent Knox', 'brent.knox106@example.com', '123456', 'Consumer'),
('Celeste Moon', 'celeste.moon107@example.com', '123456', 'Consumer'),
('Damon Black', 'damon.black108@example.com', '123456', 'Consumer'),
('Eliza Sharp', 'eliza.sharp109@example.com', '123456', 'Consumer'),
('Flynn Ford', 'flynn.ford110@example.com', '123456', 'Consumer'),
('Gia Ross', 'gia.ross111@example.com', '123456', 'Consumer'),
('Heath Pike', 'heath.pike112@example.com', '123456', 'Consumer'),
('Indie Nash', 'indie.nash113@example.com', '123456', 'Consumer'),
('Jules Grant', 'jules.grant114@example.com', '123456', 'Consumer'),
('Kaia Glenn', 'kaia.glenn115@example.com', '123456', 'Consumer'),
('Lyle Frost', 'lyle.frost116@example.com', '123456', 'Consumer'),
('Marin Walsh', 'marin.walsh117@example.com', '123456', 'Consumer'),
('Nico Berg', 'nico.berg118@example.com', '123456', 'Consumer'),
('Oakley Ford', 'oakley.ford119@example.com', '123456', 'Consumer'),
('Paige Snow', 'paige.snow120@example.com', '123456', 'Consumer'),
('Quinn Bass', 'quinn.bass121@example.com', '123456', 'Consumer'),
('Raya Finch', 'raya.finch122@example.com', '123456', 'Consumer'),
('Soren Tate', 'soren.tate123@example.com', '123456', 'Consumer'),
('Talia Hayes', 'talia.hayes124@example.com', '123456', 'Consumer'),
('Uriel Wade', 'uriel.wade125@example.com', '123456', 'Consumer'),
('Veda Hart', 'veda.hart126@example.com', '123456', 'Consumer'),
('Wyatt Nash', 'wyatt.nash127@example.com', '123456', 'Consumer'),
('Xia Frost', 'xia.frost128@example.com', '123456', 'Consumer'),
('Yuri Blair', 'yuri.blair129@example.com', '123456', 'Consumer'),
('Zora Lang', 'zora.lang130@example.com', '123456', 'Consumer'),
('Aiden Ross', 'aiden.ross131@example.com', '123456', 'Consumer'),
('Bella Lane', 'bella.lane132@example.com', '123456', 'Consumer'),
('Cruz York', 'cruz.york133@example.com', '123456', 'Consumer'),
('Daisy Neal', 'daisy.neal134@example.com', '123456', 'Consumer'),
('Eli Holt', 'eli.holt135@example.com', '123456', 'Consumer'),
('Freya Quinn', 'freya.quinn136@example.com', '123456', 'Consumer'),
('Gavin Bruce', 'gavin.bruce137@example.com', '123456', 'Consumer'),
('Hazel Fox', 'hazel.fox138@example.com', '123456', 'Consumer'),
('Ivan Moon', 'ivan.moon139@example.com', '123456', 'Consumer'),
('Jada Paul', 'jada.paul140@example.com', '123456', 'Consumer'),
('Kian Snow', 'kian.snow141@example.com', '123456', 'Consumer'),
('Lena Pike', 'lena.pike142@example.com', '123456', 'Consumer'),
('Milo Sharp', 'milo.sharp143@example.com', '123456', 'Consumer'),
('Nova Hart', 'nova.hart144@example.com', '123456', 'Consumer'),
('Owen Ross', 'owen.ross145@example.com', '123456', 'Consumer'),
('Piper Glenn', 'piper.glenn146@example.com', '123456', 'Consumer'),
('Quade Grant', 'quade.grant147@example.com', '123456', 'Consumer'),
('Rhea Walsh', 'rhea.walsh148@example.com', '123456', 'Consumer'),
('Sean Cole', 'sean.cole149@example.com', '123456', 'Consumer'),
('Tess Craig', 'tess.craig150@example.com', '123456', 'Consumer'),
('Uma Knox', 'uma.knox151@example.com', '123456', 'Consumer'),
('Vince Tate', 'vince.tate152@example.com', '123456', 'Consumer'),
('Wren Hale', 'wren.hale153@example.com', '123456', 'Consumer'),
('Xavi Drew', 'xavi.drew154@example.com', '123456', 'Consumer'),
('Yana Stone', 'yana.stone155@example.com', '123456', 'Consumer'),
('Zeke Cain', 'zeke.cain156@example.com', '123456', 'Consumer');



ALTER TABLE Reports
ADD title NVARCHAR(100) NOT NULL default 'Untitled Report',
    file_path NVARCHAR(255);




	select * from users

select * from Notifications

INSERT INTO Reports (user_id, report_type, filters_used, created_at, title, file_path)
VALUES 
(21, 'sales', 'date=2025-04-01;metric=uptime', GETDATE(), 'System Uptime Report', '/files/sales-west.pdf');

(21, 'sales', 'region=West;quarter=Q1', GETDATE(), 'Q1 Western Sales Report', '/files/sales-west-q1.pdf'),

(21, 'interactions', 'channel=email;date_range=2025-01-01_to_2025-03-31', GETDATE(), 'Q1 Email Interactions', '/files/email-q1.pdf');

SELECT * FROM Users WHERE user_id = 21;

SELECT * FROM Users WHERE user_id = 10037;


UPDATE Customers
SET
    phone = CASE WHEN phone = '' THEN '123456789' ELSE phone END,  -- Replace empty string in phone with 'N/A'
    address = CASE WHEN address = '' THEN 'Its the same' ELSE address END  -- Replace empty string in address with 'Unknown'
WHERE
    phone = '' OR address = '';



	-- 1. Add recipient_id column
ALTER TABLE Notifications
ADD recipient_id BIGINT NOT NULL;

-- 2. Add foreign key for recipient_id
ALTER TABLE Notifications
ADD CONSTRAINT FK_Notifications_Recipient
FOREIGN KEY (recipient_id) REFERENCES Users(user_id) ON DELETE CASCADE;

-- 3. Alter message column to TEXT equivalent (SQL Server doesn't support TEXT anymore, use NVARCHAR(MAX))
-- Skip this if you're already using NVARCHAR(MAX)

-- 4. Modify status column to only allow 'unread' and 'read' (remove 'archived')
ALTER TABLE Notifications
DROP CONSTRAINT [<YourCheckConstraintNameHere>];  -- Replace with actual constraint name

-- Then recreate with updated ENUM-like behavior
ALTER TABLE Notifications
ADD CONSTRAINT CHK_Notifications_Status
CHECK (status IN ('unread', 'read'));

-- 5. Modify created_at default (from GETDATE() to SYSDATETIME() if preferred)
-- (Optional, since GETDATE() is usually fine)


INSERT INTO Notifications (
    user_id,
    recipient_id,
    message,
    status,
    created_at
)
VALUES (
    10058,               -- sender's user_id
    10059,               -- recipient's user_id
    'This is a test notification message.',
    'unread',
    GETDATE()
);

select * from Customers

ALTER TABLE Notifications
DROP CONSTRAINT FK__Notifications__Recipient;

SELECT name 
FROM sys.foreign_keys 
WHERE parent_object_id = OBJECT_ID('Notifications');

DROP TABLE IF EXISTS Notifications;

CREATE TABLE Notifications (
    notification_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,              -- Sender (User)
    recipient_id BIGINT NOT NULL,         -- Recipient (Customer)
    message NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('unread', 'read', 'archived')),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    deleted_at DATETIME2 NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id), -- No cascade here
    FOREIGN KEY (recipient_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
);

select * from notifications

select * from Users

select * from Customers



