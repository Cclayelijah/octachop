# Database Backup & Restore Guide

This guide explains how to backup and restore your Octachop database.

## 📁 Backup Database

To create a backup of your current database:

```bash
cd "c:/Users/Elijah/programming/octachop"
npx tsc scripts/backup-database.ts --outDir dist && node dist/backup-database.js
```

This will create a JSON file in the `backups/` directory with a timestamp, containing all your:
- User types (admin, user, etc.)
- Users
- Songs and their levels
- Pass results (scores)
- User favorites

## 📂 Restore Database

To restore from a backup file:

```bash
cd "c:/Users/Elijah/programming/octachop"
npx tsc scripts/restore-database.ts --outDir dist && node dist/restore-database.js "backups/database_backup_YYYY-MM-DDTHH-MM-SS-sssZ.json"
```

⚠️ **WARNING**: This will completely wipe your current database and replace it with the backup data!

## 🔄 Quick Recovery Process

If you need to reset your database and restore from backup:

1. **Reset the database schema:**
   ```bash
   npx prisma migrate reset --force
   ```

2. **Restore from your backup:**
   ```bash
   npx tsc scripts/restore-database.ts --outDir dist && node dist/restore-database.js "backups/your-backup-file.json"
   ```

## 📝 Backup File Format

The backup files are JSON format containing:
- `exportDate`: When the backup was created
- `userTypes`: All user type definitions
- `users`: All user accounts
- `songs`: All songs with their associated levels
- `passResults`: All game scores and results
- `userFavorites`: All user favorite levels

## 💡 Tips

- **Regular Backups**: Run backups before major changes
- **Naming Convention**: Backup files include timestamp for easy identification
- **Storage**: Keep backup files in a safe location (consider cloud storage)
- **Testing**: Test restore process on a development database first

## 🚨 Emergency Recovery

If your database gets corrupted:

1. Check if you have recent backups in `backups/` directory
2. Run database reset: `npx prisma migrate reset --force`  
3. Restore from backup using the restore script
4. Verify data integrity by checking the application

Your most recent backup is: `database_backup_2026-01-03T12-15-02-762Z.json`