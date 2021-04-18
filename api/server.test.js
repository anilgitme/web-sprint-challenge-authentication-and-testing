const request = require('supertest');
const db = require('./../data/dbConfig');
const server = require('./server');

// Write your tests here
test('sanity', () => {
    expect(true).toBe(true)
})

beforeAll(async() => {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async() => {
    await db('users').truncate();
})

afterAll(async() => {
    await db.destroy();
})

const login = { username: 'username', password: 'password' };

describe('register', () => {
    it('should register the user', async() => {
        const res = await request(server).post('/api/auth/register').send(login)
        expect(res.status).toBe(200)
    })
    it('register should fail', async() => {
        const res = await request(server).post('/api/auth/register').send({ username: 'anil' })
        expect(res.status).toBe(400)
    })
})

describe('login', () => {
    it('should login user', async() => {
        await request(server).post('/api/auth/register').send(login)
        const res = await request(server).post('/api/auth/login').send(login)
        expect(res.status).toBe(200)
    })
    it('should fail login', async() => {
        const res = await request(server).post('/api/auth/login').send({ username: 'anil' })
        expect(res.status).toBe(400)
    })
})