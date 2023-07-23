import { Model, Document } from 'mongoose';

async function populateRefField<T extends Document, U extends Document>(
  doc: T,
  field: string,
  modelToPopulate: Model<U>,
): Promise<U | undefined> {
  if (doc[field] instanceof modelToPopulate) {
    return doc[field] as U;
  } else if (doc.populated(field)) {
    return doc[field] as any as U;
  } else {
    const populatedDocument = await doc.populate(field);
    return populatedDocument[field] as U;
  }
}

export { populateRefField };
