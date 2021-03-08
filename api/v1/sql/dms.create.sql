USE [master]
GO
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'dms') CREATE DATABASE [dms]
GO
USE dms
GO
ALTER DATABASE [dms] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [dms].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [dms] SET ANSI_NULL_DEFAULT OFF
GO
ALTER DATABASE [dms] SET ANSI_NULLS OFF
GO
ALTER DATABASE [dms] SET ANSI_PADDING OFF
GO
ALTER DATABASE [dms] SET ANSI_WARNINGS OFF
GO
ALTER DATABASE [dms] SET ARITHABORT OFF
GO
ALTER DATABASE [dms] SET AUTO_CLOSE OFF
GO
ALTER DATABASE [dms] SET AUTO_CREATE_STATISTICS ON
GO
ALTER DATABASE [dms] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [dms] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [dms] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [dms] SET CURSOR_DEFAULT  GLOBAL
GO
ALTER DATABASE [dms] SET CONCAT_NULL_YIELDS_NULL OFF
GO
ALTER DATABASE [dms] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [dms] SET QUOTED_IDENTIFIER OFF
GO
ALTER DATABASE [dms] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [dms] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [dms] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [dms] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [dms] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [dms] SET READ_COMMITTED_SNAPSHOT OFF
GO
ALTER DATABASE [dms] SET HONOR_BROKER_PRIORITY OFF
GO
ALTER DATABASE [dms] SET RECOVERY SIMPLE
GO
ALTER DATABASE [dms] SET  MULTI_USER
GO
ALTER DATABASE [dms] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [dms] SET DB_CHAINING OFF
GO
ALTER DATABASE [dms] SET TARGET_RECOVERY_TIME = 0 SECONDS
GO
USE [dms]
GO
/****** Object:  Table [dbo].[acsmLog]    Script Date: 24-9-2019 00:54:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
if not exists (select * from sysobjects where name='acsmLog' and xtype='U')
CREATE TABLE [dbo].[acsmLog](
	[ts] [timestamp] NOT NULL,
	[dt] [datetime] NULL,
	[params] [varchar](max) NULL,
 CONSTRAINT [PK_wsdlLog] PRIMARY KEY CLUSTERED
(
	[ts] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[io]    Script Date: 24-9-2019 00:54:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
if not exists (select * from sysobjects where name='io' and xtype='U')
CREATE TABLE [dbo].[io](
	[ruimte] [varchar](500) NULL,
	[instance] [varchar](500) NULL,
	[kast] [varchar](500) NULL,
	[netwerk] [varchar](500) NULL,
	[nummer] [varchar](500) NULL,
	[aansluiting] [varchar](500) NULL,
	[omschrijving] [varchar](500) NULL,
	[tag] [varchar](500) NULL,
	[signaal] [varchar](500) NULL,
	[contact] [varchar](500) NULL,
	[soort] [varchar](500) NULL,
	[apparaat] [varchar](500) NULL,
	[stand] [varchar](500) NULL,
	[id] [int] IDENTITY(1,1) NOT NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[log]    Script Date: 24-9-2019 00:54:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
if not exists (select * from sysobjects where name='log' and xtype='U')
CREATE TABLE [dbo].[log](
	[ts] [timestamp] NOT NULL,
	[LogID] [int] IDENTITY(1,1) NOT NULL,
	[LogDateTime] [datetime] NULL,
	[Method] [varchar](500) NULL,
	[Step] [varchar](50) NULL,
	[Data] [varchar](max) NULL,
	[Tag] [varchar](50) NULL,
 CONSTRAINT [PK_log] PRIMARY KEY CLUSTERED
(
	[ts] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[MessageLog]    Script Date: 24-9-2019 00:54:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
if not exists (select * from sysobjects where name='MessageLog' and xtype='U')
CREATE TABLE [dbo].[MessageLog](
	[LogID] [int] IDENTITY(1,1) NOT NULL,
	[TimeStamp] [datetime] NULL,
	[Method] [varchar](50) NULL,
	[Params] [varchar](max) NULL,
	[Response] [varchar](max) NULL,
 CONSTRAINT [PK_log_1] PRIMARY KEY CLUSTERED
(
	[LogID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[station]    Script Date: 24-9-2019 00:54:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
if not exists (select * from sysobjects where name='station' and xtype='U')
CREATE TABLE [dbo].[station](
	[instance] [varchar](500) NULL,
	[system] [varchar](500) NULL,
	[groupname] [varchar](500) NULL,
	[place] [varchar](500) NULL,
	[ip] [varchar](500) NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[interfacetype] [varchar](50) NULL,
	[active] [bit] NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[WebLogItem]    Script Date: 24-9-2019 00:54:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
if not exists (select * from sysobjects where name='WebLogItem' and xtype='U')
CREATE TABLE [dbo].[WebLogItem](
	[LogID] [int] IDENTITY(1,1) NOT NULL,
	[SystemInstanceID] [int] NULL,
	[GroupID] [int] NULL,
	[LocationID] [int] NULL,
	[TagID] [int] NULL,
	[LogType] [varchar](50) NULL,
	[TextualValue] [varchar](250) NULL,
	[NumericValue] [float] NULL,
	[TimeStamp] [datetime] NULL,
	[Quality] [varchar](50) NULL,
	[StandardOutput] [varchar](50) NULL,
 CONSTRAINT [PK_WebLogItem] PRIMARY KEY CLUSTERED
(
	[LogID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
if not exists (select * from sysobjects where name='DF_wsdlLog_dt' and xtype='D')
ALTER TABLE [dbo].[acsmLog] ADD  CONSTRAINT [DF_wsdlLog_dt]  DEFAULT (getutcdate()) FOR [dt]
GO
if not exists (select * from sysobjects where name='DF_log_LogDateTime_1' and xtype='D')
ALTER TABLE [dbo].[log] ADD  CONSTRAINT [DF_log_LogDateTime_1]  DEFAULT (getutcdate()) FOR [LogDateTime]
GO
if not exists (select * from sysobjects where name='DF_log_LogDateTime' and xtype='D')
ALTER TABLE [dbo].[MessageLog] ADD  CONSTRAINT [DF_log_LogDateTime]  DEFAULT (getutcdate()) FOR [TimeStamp]
GO
if not exists (select * from sysobjects where name='DF_WebLogItem_TimeStamp' and xtype='D')
ALTER TABLE [dbo].[WebLogItem] ADD  CONSTRAINT [DF_WebLogItem_TimeStamp]  DEFAULT (getutcdate()) FOR [TimeStamp]
GO
USE [master]
GO
ALTER DATABASE [dms] SET  READ_WRITE
GO
