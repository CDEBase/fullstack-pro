/* eslint-disable @typescript-eslint/no-explicit-any */
 
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
 
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { CdmLogger } from '@cdm-logger/core';
import { Container } from 'inversify';
import { Connection,Schema } from 'mongoose';

export const MigrationSchema = new Schema({
	migrated_at: Date,
	name: { required: true, type: String },
});

export async function migrate(
	db: Connection,
	container: Container,
	logger: CdmLogger.ILogger
) {
	try {
		const migrations = container.getAll<{ id: any, up: any; }>(
			'MongodbMigration'
		);
		const model = db.model<any, any>('Migration', MigrationSchema);
		return await Promise.all(
			migrations.map(async (migration) => {
				const exists = await model.findOne({ name: migration.id });
				if (!exists) {
					logger.info('Migrating %s', migration.id);
					try {
						await migration.up();
						await model.create({ name: migration.id, migrated_at: new Date() });
					} catch (e) {
						console.log(`Can not process migration ${migration.id}: `, e);
					}
				}
				return migration.id;
			})
		);
	} catch (err) {
		console.warn('ignoring migrate database due to ', err.message);
	}
}
