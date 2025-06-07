import type { ServerMethods } from '@rocket.chat/ddp-client';
import { analyzeSentiment } from '@rocket.chat/ai-utils';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

declare module '@rocket.chat/ddp-client' {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        interface ServerMethods {
                analyzeMessageSentiment(text: string): unknown;
        }
}

Meteor.methods<ServerMethods>({
        analyzeMessageSentiment(text) {
                check(text, String);

                const uid = Meteor.userId();
                if (!uid) {
                        throw new Meteor.Error('error-invalid-user', 'Invalid user', {
                                method: 'analyzeMessageSentiment',
                        });
                }

                return analyzeSentiment(text);
        },
});
