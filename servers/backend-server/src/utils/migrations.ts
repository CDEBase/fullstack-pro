/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Schema, Connection } from 'mongoose';
import { Container } from 'inversify';

export const MigrationSchema = new Schema({
    migrated_at: Date,
    name: { required: true, type: String },
});

export async function migrate(db: Connection, container: Container) {
    try {
        const migrations = container.getAll<{up: any}>('MongodbMigration');
        const model = db.model<any, any>('Migration', MigrationSchema);
        return await Promise.all(
            migrations.map(async (migration) => {
                const exists = await model.findOne({ name: migration.id });
                if (!exists) {
                    try {
                        await migration.up();
                        await model.create({ name: migration.id, migrated_at: new Date() });
                    } catch (e) {
                        console.log(`Can not process migration ${migration.id}: `, e);
                    }
                }

                return migration.id;
            }),
        );
    } catch (err) {
        console.warn('ignoring migrate database due to ', err.message);
    }
}
