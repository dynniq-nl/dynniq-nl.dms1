USE Aim
GO
ALTER PROCEDURE [api].[getItem] @id INT=NULL OUTPUT,@hostID INT,@schema VARCHAR (50)=NULL,@class VARCHAR (50)=NULL,@classID INT=NULL,@tag VARCHAR (50)=NULL,@keyname VARCHAR (50)=NULL,@title VARCHAR(500)=NULL,@toID INT=NULL 
AS
	IF @schema IS NOT NULL SET @class=@schema
	IF @classID IS NULL SELECT @classID=id FROM om.class WHERE class=@class 
	IF @classID IS NULL BEGIN SELECT @classID=MAX(id)+1 FROM om.class INSERT om.class (id,class) VALUES (@classID,@class) END 
	IF @id IS NOT NULL AND NOT EXISTS(SELECT 0 FROM om.items WHERE id=@id) --SELECT 0 FROM om.items WHERE id=3562758
	BEGIN
		SET IDENTITY_INSERT om.items ON
		INSERT om.items (classID,id,title)VALUES(@classID,@id,@title)
		SET IDENTITY_INSERT om.items OFF
	END
	IF @id IS NOT NULL UPDATE om.items SET hostID=ISNULL(@hostID,hostID),keyname=ISNULL(@keyname,keyname),tag=ISNULL(@tag,tag),toID=ISNULL(@toID,toID) WHERE id=@id
	IF @id IS NULL AND @tag IS NOT NULL SELECT @id=id FROM om.items WHERE deletedDT IS NULL AND hostID=@hostID AND classID=@classID AND tag=@tag 
	IF @id IS NULL AND @keyName IS NOT NULL SELECT @id=id FROM om.items WHERE deletedDT IS NULL AND hostID=@hostID AND classID=@classID AND keyname=@keyName
	IF @id IS NULL BEGIN INSERT om.items (hostID,classID,tag,keyname)VALUES (@hostID,@classID,@tag,@keyname) SET @id=SCOPE_IDENTITY () END
GO

ALTER PROCEDURE api.setAccount @email VARCHAR(500), @host VARCHAR(50), @group VARCHAR(50), @password VARCHAR(50)=NULL, @hostID INT=NULL OUTPUT, @userID INT=NULL OUTPUT, @accountID INT=NULL OUTPUT, @groupID INT=NULL OUTPUT,@select BIT=NULL
AS
	DECLARE @emailAID INT
	IF NOT EXISTS(SELECT 0 FROM om.class WHERE id=1000)INSERT om.class(id,class)VALUES(1000,'Account')
	IF NOT EXISTS(SELECT 0 FROM om.class WHERE id=1002)INSERT om.class(id,class)VALUES(1002,'Company')
	IF NOT EXISTS(SELECT 0 FROM om.class WHERE id=1003)INSERT om.class(id,class)VALUES(1003,'Group')
	IF NOT EXISTS(SELECT 0 FROM om.class WHERE id=1004)INSERT om.class(id,class)VALUES(1004,'Contact')
	IF NOT EXISTS(SELECT 0 FROM om.attributeName WHERE id=30)
	BEGIN
		SET IDENTITY_INSERT om.attributeName ON
		INSERT om.attributeName(id,name)VALUES(30,'Email')
		SET IDENTITY_INSERT om.attributeName OFF
	END
	IF NOT EXISTS(SELECT 0 FROM om.attributeName WHERE id=3)
	BEGIN
		SET IDENTITY_INSERT om.attributeName ON
		INSERT om.attributeName(id,name)VALUES(3,'groupID')
		SET IDENTITY_INSERT om.attributeName OFF
	END
	EXEC api.getItem @id=@hostID OUTPUT,@hostID=1,@title=@host,@keyname=@host,@classID=1002
	EXEC api.getItem @id=@userID OUTPUT,@hostID=@hostID,@title=@email,@classID=1000
	EXEC api.getItem @id=@groupID OUTPUT,@hostID=@hostID,@title=@group,@classID=1003
	EXEC api.getItem @id=@accountID OUTPUT,@hostID=@hostID,@title=@email,@classID=1004,@toID=@userID
	EXEC api.setAttribute @id=@accountID,@fieldID=3,@itemID=@groupID,@classID=1003

	IF NOT EXISTS(SELECT 0 FROM auth.users WHERE id=@userID) INSERT auth.users(id)VALUES(@userID)
	IF EXISTS(SELECT 0 FROM om.attributes WHERE fieldID=30 AND value=@email)UPDATE om.attributes SET id=@userID WHERE fieldID=30 AND value=@email
	ELSE EXEC api.setAttribute @id=@userID,@fieldID=30,@value=@email
	IF @password IS NOT NULL UPDATE auth.users SET password=pwdencrypt(@password)
	IF @select IS NOT NULL
		SELECT @email email,@host hostName, @group groupName, @userID userID, @hostID hostID, @accountID accountID, @groupID groupID
GO
ALTER PROCEDURE api.getAccount @email VARCHAR(500), @host VARCHAR(50)=NULL, @group VARCHAR(50)=NULL, @password VARCHAR(50)=NULL, @hostID INT=NULL OUTPUT, @userID INT=NULL OUTPUT, @accountID INT=NULL OUTPUT, @groupID INT=NULL OUTPUT,@verified BIT=NULL OUTPUT,@pwOK BIT=NULL OUTPUT,@select BIT=NULL
AS
	DECLARE @userName VARCHAR(500)
	IF @hostID IS NULL SELECT @hostID=id FROM api.items WHERE keyname=@host
	SELECT @userID=id,@verified=CASE WHEN id=userID THEN 1 ELSE 0 END FROM om.attributes WHERE fieldID=30 AND value=@email
	SELECT @pwOK=pwdcompare(@password,password)FROM auth.users WHERE id=@userID
	SELECT @accountID=I.id,@groupID=A.itemID 
		FROM api.items I
		INNER JOIN om.attributes A ON I.hostID=@hostID AND A.id=I.id AND A.fieldID=3 AND I.toID=@userID AND @pwOK=1 AND @verified=1
		--WHERE classID=1004 AND hostID=@hostID AND toID=@userID AND id IN (SELECT id FROM om.attributes WHERE hostID=@hostID AND fieldID=3 AND itemID IS NOT NULL)
	SELECT @userName=title FROM om.items WHERE id=@userID

	IF @select IS NOT NULL 
		SELECT @email email,@userName userName,@host hostName, @group groupName, @verified verified, @pwOK pwOK, @userID userID, @hostID hostID, @accountID accountID, @groupID groupID
GO
--DELETE om.items WHERE classID=1000;DELETE auth.users

DECLARE @userID INT,@accountID INT,@hostID INT,@groupID INT
SET @accountID = 3562754
SET @userID = 265090
SET @hostID = 3562718
SET @groupID = 3562758

EXEC api.setAccount @email='max@alicon.nl',@password='Mjkmjkmjk0',@host='dms',@group='Admin',@userID=@userID OUTPUT, @accountID=@accountID OUTPUT, @hostID=@hostID OUTPUT, @groupID=@groupID OUTPUT,@select=1

--EXEC api.getAccount @email='max@alicon.nl',@password='!dynniq1234',@host='dms',@hostID=@hostID OUTPUT, @userID=@userID OUTPUT, @accountID=@accountID OUTPUT, @groupID=@groupID OUTPUT,@select=1
EXEC api.getAccount @email='max@alicon.nl',@password='!dynniq1234',@host='dms',@select=1

--EXEC setAccount @email='dms@alicon.nl',@password='!dynniq1234',@userID=@userID OUTPUT, @accountID=
--SELECT * FROM om.attributeName WHERE name='groupID'

--SELECT id,password FROM auth.users
--SELECT * FROM api.items WHERE classID in (1000,1002,1003,1004)
SELECT * FROM api.citems WHERE id IN (@userID,@accountID)
SELECT * FROM api.attributes WHERE id IN (@userID,@accountID)
--SELECT * FROM om.class

--DELETE om.attributeName where id=1228
