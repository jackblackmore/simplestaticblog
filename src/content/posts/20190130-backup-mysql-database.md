---
title: Automating MYSQL database backups
tags: devops
date: 2019-01-30
---
Lifted almost entirely from[https://www.serverlab.ca/tutorials/linux/database-servers/create-a-read-only-backup-account-for-mysql](https://www.serverlab.ca/tutorials/linux/database-servers/create-a-read-only-backup-account-for-mysql)

## Create a Read-Only MySQL backup account
```bash
mysql -uROOTUSER -p'PASSWORD'
```

```sql
GRANT LOCK TABLES, SELECT ON *.* TO 'backupuser'@'%' IDENTIFIED BY 'PASSWORD';
FLUSH PRIVILEGES;
```

## Automating Backup
### Create the script
Create a backup script with RWX for only root or the backup owner

```bash
#!/bin/bash

# Set the backup date
BACKUP_DATE=`date +%Y-%m-%d`
BACKUP_DIR=/path/to/backups/mysql
BACKUP_HISTORY=5

# Dump the database
mysqldump -ubackupuser -p'PASSWORD' --all-databases > $BACKUP_DIR/dump_$BACKUP_DATE.sql

# Remove all but the latest backups
cd $BACKUP_DIR
ls -1tr | head -n -$BACKUP_HISTORY | xargs -d '\n' rm -f --
```

```bash
chown 700 backup_script.sh
```

### Schedule with Cron

Run as root
```bash
crontab -e
```
Add the following to run at 4am every day
```bash
0 4 * * * /path/to/backup_script.sh
```

