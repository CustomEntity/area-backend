import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { afterAll, beforeAll, describe, it, jest } from '@jest/globals';
import { AppModule } from '../../../core/app.module';
import { RedisService } from '../../../core/adapters/redis/redis.service';
import { KafkaService } from '../../../core/adapters/kafka/kafka.service';
import { ConfigService } from '@nestjs/config';

describe('AppletController (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let userCookies: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          if (key === 'encryptionSecretKey')
            return 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
          if (key === 'encryptionSecretIV')
            return '08c4bdc5ebab3567ef2c9e8c9f9e9e9e';
          if (key === 'systemEpoch') return 1609459200000;
          if (key === 'jwtSecret') return 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
          if (key === 'jwtExpiresIn') return '1d';
        }),
      })
      .overrideProvider(RedisService)
      .useValue({})
      .overrideProvider(KafkaService)
      .useValue({
        init: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const registerResp = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test',
        lastName: 'test',
        email: 'test123@gmail.com',
        password: 'test12345678',
      });

    const cookies = registerResp.headers['set-cookie'];
    userCookies = cookies;

    const userResp = await request(app.getHttpServer())
      .get('/users/@me')
      .set('Cookie', cookies)
      .set('Accept', 'application/json')
      .expect(200);

    userId = userResp.body.id;
  }, 100000);

  it('should create an applet successfully', async () => {
    const appletData = {
      name: 'Test Applet',
      description: 'This is a test applet',
      userId: userId,
      eventId: '1',
      reactionId: '2',
      eventTriggerData: {
        branch: 'master',
        repository: 'CustomEntity/test-js-repository',
      },
      eventConnectionId: '401743617342640129',
      reactionConnectionId: '402009451382247425',
      reactionParametersData: {
        door: '4eme',
      },
    };

    const appletRes = await request(app.getHttpServer())
      .post(`/users/${userId}/applets`)
      .send(appletData)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json')
      .expect(201);

    console.log(appletRes.body);
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json');
    await app.close();
  });
});
