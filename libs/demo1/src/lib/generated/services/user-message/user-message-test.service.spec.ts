import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { USER_MESSAGE_PROVIDER } from './user-message.provider';
import { UserMessageTestService } from './user-message-test.service'
import { BIZ_PROVIDER } from '../biz';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { UserMessage } from '../../interfaces/user-message.model';
import shortUUID from 'short-uuid';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('USER_MESSAGE', () => {
    let poolService: PostgresPoolService;
    let userMessageTestService: UserMessageTestService;
    let _messages: ReplaySubject<UserMessage[]> = new ReplaySubject<UserMessage[]>(1);
    let messages: UserMessage[];


    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
				ConfigModule.forRoot({
					envFilePath: ['.test.env'],
					isGlobal: true,
					validationSchema: Joi.object(configSchema)
				}),
			],
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...USER_MESSAGE_PROVIDER,
                UserMessageTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        userMessageTestService = app.get<UserMessageTestService>(UserMessageTestService);

        _messages = new ReplaySubject<UserMessage[]>(1);
        messages = [
            {
                userMessageId: shortUUID.generate(),
                title: 'me',
                description: 'message 1'
            },
            {
                userMessageId: shortUUID.generate(),
                title: 'me',
                description: 'message 2'
            },
            {
                userMessageId: shortUUID.generate(),
                title: 'me',
                description: 'message 3'
            },
            {
                userMessageId: shortUUID.generate(),
                title: 'me',
                description: 'message 4'
            },
        ]

        _messages.subscribe( s => {
            console.log(s)
        })


    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('USER_MESSAGE <test case group description>', () => {

        it('#1.1 Add', async () => {

            const newMessage: UserMessage = {
                userMessageId: userMessageTestService.service.generateId(),
                title: 'me',
                description: 'message 5'
            }


            const apolloAdd = (message: UserMessage): Observable<UserMessage> => new Observable((subscriber) => {
                subscriber.next(message);
                subscriber.complete();
            });


            const messages$ = _messages.asObservable();

            const addMessage = (message: UserMessage) => apolloAdd(message).pipe(
                    map((newMessage) => {
                        // Update the messages with the new message
                        messages = messages || [];
                        _messages.next([...messages, newMessage]);

                        // Return the new message from observable
                        return newMessage;
                    })
            )

            addMessage(newMessage).subscribe( d => {
                console.log(d)
            })

            expect(true).toBe(true)

        })
        it('#1.1 Update', async () => {

            const apolloUpdate = (message: UserMessage): Observable<UserMessage> => new Observable((subscriber) => {
                subscriber.next(message);
                subscriber.complete();
            });

            const messages$ = _messages.asObservable();

            const msg3 = messages[3]

            msg3.description = 'modified message 4'

            const updateMessage = (id: string, message: UserMessage) => apolloUpdate(message).pipe(
                    map((newMessage) => {

                        const idx = messages.findIndex( m => m.userMessageId === id )

                        messages[idx] = message;

                        _messages.next(messages);

                        // Return the new message from observable
                        return message;
                    })
            )

            updateMessage(msg3.userMessageId, msg3).subscribe( d => {
                console.log(d)
            })

            expect(true).toBe(true)

        })
        it('#1.1 Delete', async () => {

            const apolloDelete = (id: string): Observable<boolean> => new Observable((subscriber) => {
                subscriber.next(true);
                subscriber.complete();
            });

            const messages$ = _messages.asObservable();

            const msg3 = messages[3]

            msg3.description = 'modified message 4'

            const deleteMessage = (id: string) => apolloDelete(id).pipe(
                    map((isDeleted) => {

                        const idx = messages.findIndex( m => m.userMessageId === id )

                        messages.splice(idx,1);

                        _messages.next(messages);

                        return isDeleted

                    })
            )

            deleteMessage(msg3.userMessageId).subscribe( d => {
                console.log(d)
            })

            expect(true).toBe(true)

        })

        it('#1.1 Get', async () => {


            const apolloQuery: Observable<{ data: { userMessage: UserMessage[]; } }> = new Observable( (subscriber) => {
                subscriber.next({ data: { userMessage: messages } })
                subscriber.complete
            })

            apolloQuery.pipe(
                tap((res) => {
                    _messages.next(res.data.userMessage);
                })
            ).subscribe( d => {
                console.log(d)
            })

            expect(true).toBe(true)
        })
    })

});