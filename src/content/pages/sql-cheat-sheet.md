---
title:: SQL Cheat Sheet
tags: cheatsheet
---
# Useful queries

###	FIND REFERENCING OBJECTS:
```sql
SELECT DISTINCT 
       o.Name AS [TableName]
     , sp.Name
     , sp.type_desc AS [Found In]
  FROM sys.objects AS o
  INNER JOIN sys.sql_expression_dependencies AS sd
    ON o.object_id = sd.referenced_id
  INNER JOIN sys.objects AS sp
    ON sd.referencing_id = sp.object_id
       AND sp.type IN('P', 'FN', 'V')
 WHERE o.name IN ( 'tab_CMSOPENclient', 'tabTabsClient', 'vewtabTabsClient', 'vewHKRptClientListsForHAWKandCMSOpen', 'sp_RefreshTaBsClient' )
ORDER BY sp.Name
```  

### FIND REFERENCING COLUMNS:
```sql	

SELECT sys.objects.object_id
     , sys.schemas.name AS [Schema]
     , sys.objects.name AS Object_Name
     , sys.objects.type_desc AS [Type]
  FROM sys.sql_modules(NOLOCK)
  INNER JOIN sys.objects(NOLOCK)
    ON sys.sql_modules.object_id = sys.objects.object_id
  INNER JOIN sys.schemas(NOLOCK)
    ON sys.objects.schema_id = sys.schemas.schema_id
 WHERE sys.sql_modules.definition COLLATE SQL_Latin1_General_CP1_CI_AS LIKE '%{Column Name}%' ESCAPE '\'
ORDER BY sys.objects.type_desc
       , sys.schemas.name
       , sys.objects.name
```
# Indexes

## Naming Conventions

PK_ for primary keys
UK_ for unique keys
IX_ for non clustered non unique indexes
UX_ for unique indexes
`<index or key type>_<table name>_<column 1>_<column 2>_<column n>`

## Unique Indexed View
```sql
create view [dbo].[vewIndexedPagerByNino] with SchemaBinding as
select left(m_nino,8) shortnino
     , pager
	 , count_big(*) count
  from dbo.member m
  join dbo.person p
    on p.prsnid = m.prsnid
 where pager is not null
   and m_nino is not null
 group by left(m_nino,8), pager
GO

CREATE UNIQUE CLUSTERED INDEX [IX_CHECK_Pager_By_NINO] ON [dbo].[vewIndexedPagerByNino]
(
	[shortnino] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO


```
