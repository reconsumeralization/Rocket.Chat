import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';

import { LivechatContactsRaw } from '../../../../../../packages/models/src/models/LivechatContacts';
import type { Db } from 'mongodb';

function createModel(count: sinon.SinonStub): LivechatContactsRaw {
        const db = {
                collection: () => ({
                        createIndexes: sinon.stub().resolves(),
                        countDocuments: count,
                }),
        } as unknown as Db;
        return new LivechatContactsRaw(db);
}

describe('LivechatContactsRaw.countByContactInfo', () => {
        it('should return count when matching by contactId', async () => {
                const countStub = sinon.stub().resolves(1);
                const model = createModel(countStub);
                const result = await model.countByContactInfo({ contactId: 'id1' });
                expect(countStub.firstCall.args[0]).to.deep.equal({ _id: 'id1' });
                expect(result).to.equal(1);
        });

        it('should return count when matching by email', async () => {
                const countStub = sinon.stub().resolves(2);
                const model = createModel(countStub);
                const result = await model.countByContactInfo({ email: 'test@acme.com' });
                expect(countStub.firstCall.args[0]).to.deep.equal({ 'emails.address': 'test@acme.com' });
                expect(result).to.equal(2);
        });

        it('should return count when matching by phone', async () => {
                const countStub = sinon.stub().resolves(3);
                const model = createModel(countStub);
                const result = await model.countByContactInfo({ phone: '555-1234' });
                expect(countStub.firstCall.args[0]).to.deep.equal({ 'phones.phoneNumber': '555-1234' });
                expect(result).to.equal(3);
        });

        it('should return count when matching by id, email and phone', async () => {
                const countStub = sinon.stub().resolves(4);
                const model = createModel(countStub);
                const result = await model.countByContactInfo({ contactId: 'id2', email: 'a@b.c', phone: '777' });
                expect(countStub.firstCall.args[0]).to.deep.equal({ _id: 'id2', 'emails.address': 'a@b.c', 'phones.phoneNumber': '777' });
                expect(result).to.equal(4);
        });

        it('should return zero when no contact matches', async () => {
                const countStub = sinon.stub().resolves(0);
                const model = createModel(countStub);
                const result = await model.countByContactInfo({ contactId: 'missing', email: 'none@acme.com', phone: '000' });
                expect(countStub.firstCall.args[0]).to.deep.equal({ _id: 'missing', 'emails.address': 'none@acme.com', 'phones.phoneNumber': '000' });
                expect(result).to.equal(0);
        });
});
