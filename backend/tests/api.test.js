import request from 'supertest';
import express from 'express';
import { AuthRouter } from '../routes/auth.routes.js';
import { EmpoloyerRouter } from '../routes/employer.route.js';
import { ManagerRoutes } from '../routes/manager.routes.js';
import { User } from '../models/user.model.js';
import { Lead } from '../models/leads.model.js';
import jwt from 'jsonwebtoken';

// Setup test app
const app = express();
app.use(express.json());
app.use('/api/auth', AuthRouter);
app.use('/api/employer', EmpoloyerRouter);
app.use('/api/managers', ManagerRoutes);

// Test data
let employerToken, managerToken;
let employerId, managerId, leadId;

// Helper to create test users
const createTestUsers = async () => {
  // Clear existing test users
  await User.deleteMany({ email: /test@example.com/ });
  
  // Create employer
  const employer = await User.create({
    name: 'Test Employer',
    email: 'employer.test@example.com',
    password: 'password123',
    role: 'employer'
  });
  employerId = employer._id;
  employerToken = jwt.sign(
    { id: employer._id, role: 'employer' },
    process.env.JWT_KEY,
    { expiresIn: '1h' }
  );
  
  // Create manager
  const manager = await User.create({
    name: 'Test Manager',
    email: 'manager.test@example.com',
    password: 'password123',
    role: 'manager'
  });
  managerId = manager._id;
  managerToken = jwt.sign(
    { id: manager._id, role: 'manager' },
    process.env.JWT_KEY,
    { expiresIn: '1h' }
  );
};

// Auth Routes Tests
describe('Auth Routes', () => {
  beforeAll(async () => {
    await createTestUsers();
  });

  test('POST /api/auth/login - should login successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'employer.test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.role).toBe('employer');
  });

  test('GET /api/auth/me - should return user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${employerToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test Employer');
    expect(res.body).toHaveProperty('email', 'employer.test@example.com');
  });
});

// Employer Routes Tests
describe('Employer Routes', () => {
  beforeAll(async () => {
    // Clear test leads
    await Lead.deleteMany({ companyName: 'Test Company' });
  });

  test('GET /api/employer/dashboard-stats - should return lead stats', async () => {
    const res = await request(app)
      .get('/api/employer/dashboard-stats')
      .set('Authorization', `Bearer ${employerToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('PENDING');
    expect(res.body).toHaveProperty('IN_PROGRESS');
    expect(res.body).toHaveProperty('COMPLETED');
    expect(res.body).toHaveProperty('CANCELED');
  });

  test('GET /api/employer/managers - should return managers list', async () => {
    const res = await request(app)
      .get('/api/employer/managers')
      .set('Authorization', `Bearer ${employerToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/employer/managers - should create a manager', async () => {
    const res = await request(app)
      .post('/api/employer/managers')
      .set('Authorization', `Bearer ${employerToken}`)
      .send({
        name: 'New Test Manager',
        email: 'new.manager.test@example.com',
        password: 'password123',
        role: 'manager'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'New Test Manager');
  });

  test('PUT /api/employer/managers/:managerId - should update a manager', async () => {
    const res = await request(app)
      .put(`/api/employer/managers/${managerId}`)
      .set('Authorization', `Bearer ${employerToken}`)
      .send({
        name: 'Updated Manager Name'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Manager Name');
  });

  test('POST /api/employer/leads - should create a lead', async () => {
    const res = await request(app)
      .post('/api/employer/leads')
      .set('Authorization', `Bearer ${employerToken}`)
      .send({
        contactName: 'Test Contact',
        contactEmail: 'contact@test.com',
        companyName: 'Test Company',
        status: 'PENDING',
        manager: managerId
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('contactName', 'Test Contact');
    leadId = res.body._id;
  });

  test('GET /api/employer/leads - should return leads list', async () => {
    const res = await request(app)
      .get('/api/employer/leads')
      .set('Authorization', `Bearer ${employerToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/employer/leads/:leadId - should update a lead', async () => {
    const res = await request(app)
      .put(`/api/employer/leads/${leadId}`)
      .set('Authorization', `Bearer ${employerToken}`)
      .send({
        status: 'IN_PROGRESS'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'IN_PROGRESS');
  });

  test('DELETE /api/employer/leads/:leadId - should delete a lead', async () => {
    const res = await request(app)
      .delete(`/api/employer/leads/${leadId}`)
      .set('Authorization', `Bearer ${employerToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Lead deleted');
  });

  test('DELETE /api/employer/managers/:managerId - should delete a manager', async () => {
    // Create a temporary manager to delete
    const tempManager = await User.create({
      name: 'Temp Manager',
      email: 'temp.manager@example.com',
      password: 'password123',
      role: 'manager'
    });
    
    const res = await request(app)
      .delete(`/api/employer/managers/${tempManager._id}`)
      .set('Authorization', `Bearer ${employerToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Manager deleted');
  });
});

// Manager Routes Tests
describe('Manager Routes', () => {
  beforeAll(async () => {
    // Create a test lead assigned to the manager
    const lead = await Lead.create({
      contactName: 'Manager Test Contact',
      contactEmail: 'manager.contact@test.com',
      companyName: 'Manager Test Company',
      status: 'PENDING',
      manager: managerId
    });
    leadId = lead._id;
  });

  test('GET /api/managers/leads - should return assigned leads', async () => {
    const res = await request(app)
      .get('/api/managers/leads')
      .set('Authorization', `Bearer ${managerToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PATCH /api/managers/leads/:id - should update a lead', async () => {
    const res = await request(app)
      .patch(`/api/managers/leads/${leadId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        status: 'COMPLETED',
        notes: 'Completed by manager'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'COMPLETED');
  });
});