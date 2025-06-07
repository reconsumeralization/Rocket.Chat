import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

type ServiceModule = typeof import('../../../../ee/server/local-services/voip-freeswitch/service');

describe('VoIP FreeSwitch Service - event persistence', () => {
        const registerEvent = sinon.stub();
        const serviceStarterStub = class { start() {} };
        const Service: ServiceModule['VoipFreeSwitchService'] = proxyquire.noCallThru().load('../../../../ee/server/local-services/voip-freeswitch/service', {
                '@rocket.chat/models': { FreeSwitchEvent: { registerEvent }, FreeSwitchCall: {}, Users: {} },
                '../../../../app/settings/server': { settings: { get: sinon.stub() } },
                '@rocket.chat/core-services': { ServiceStarter: serviceStarterStub },
        }).VoipFreeSwitchService;

        let service: InstanceType<Service>;
        beforeEach(() => {
                registerEvent.resetHistory();
                service = new Service();
                sinon.stub(service as any, 'parseEventData').resolves({ eventName: 'CHANNEL_CREATE', call: { UUID: '123' } });
        });

        afterEach(() => {
                (service as any).parseEventData.restore();
        });

        it('should write parsed events using the FreeSwitchEvent model', async () => {
                await (service as any).onFreeSwitchEvent('CHANNEL_CREATE', { 'Unique-ID': 'u1', 'Channel-Call-UUID': '123' });
                expect(registerEvent.calledOnce).to.be.true;
                expect(registerEvent.firstCall.args[0]).to.have.property('call');
                expect(registerEvent.firstCall.args[0].call).to.have.property('UUID', '123');
        });
});
