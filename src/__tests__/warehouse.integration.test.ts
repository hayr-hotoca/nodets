import request from 'supertest';
import { createApp } from '../app';
import { query } from '../db/pool';

// Mock module db pool
jest.mock('../db/pool', () => ({
  query: jest.fn(),
}));

const mockQuery = query as jest.Mock;

describe('Warehouse API (Integration Test)', () => {
  const app = createApp();

  const mockWarehouse = {
    id: '1', // BIGSERIAL is typically returned as string/number depending on config, pg driver returns it as string/number
    code: 'KHO-01',
    name: 'Kho Tổng',
    location: 'Tầng 1, Toà nhà A',
    address: '123 Đường Lê Lợi, Q.1, TP.HCM',
    manager_name: 'Nguyễn Văn A',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('GET /api/warehouses', () => {
    it('should return paginated warehouses list', async () => {
      // Mock count query
      mockQuery.mockResolvedValueOnce({
        rows: [{ total: '1' }],
        rowCount: 1,
      });

      // Mock select query
      mockQuery.mockResolvedValueOnce({
        rows: [mockWarehouse],
        rowCount: 1,
      });

      const response = await request(app)
        .get('/api/warehouses')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: [
          {
            ...mockWarehouse,
            // When stringified, dates match the JSON format
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });

      // Verify DB queries called
      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(mockQuery.mock.calls[0][0]).toContain('SELECT COUNT(*)');
      expect(mockQuery.mock.calls[1][0]).toContain('SELECT * FROM warehouses');
    });

    it('should filter by is_active query param', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ total: '0' }] });
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/warehouses')
        .query({ is_active: 'true' });

      expect(response.status).toBe(200);
      expect(mockQuery.mock.calls[0][1]).toContain(true);
    });

    it('should return 400 validation error for invalid query params', async () => {
      const response = await request(app)
        .get('/api/warehouses')
        .query({ page: -1, limit: 150 }); // limit max is 100, page must be positive

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toBeDefined();
    });
  });

  describe('GET /api/warehouses/:id', () => {
    it('should return warehouse details if it exists', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [mockWarehouse],
        rowCount: 1,
      });

      const response = await request(app).get('/api/warehouses/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockWarehouse,
      });
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery.mock.calls[0][0]).toContain('WHERE id = $1');
      expect(mockQuery.mock.calls[0][1]).toEqual([1]);
    });

    it('should return 404 if warehouse is not found', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });

      const response = await request(app).get('/api/warehouses/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/warehouses', () => {
    const validDto = {
      code: 'KHO-TEST',
      name: 'Kho Thử Nghiệm',
      location: 'Khu Công Nghệ Cao',
      address: 'Đường D1, TP. Thủ Đức',
      manager_name: 'Trần Văn B',
    };

    it('should create a new warehouse', async () => {
      // Mock findByCode -> null
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });

      // Mock create -> mockWarehouse
      mockQuery.mockResolvedValueOnce({
        rows: [{ ...mockWarehouse, code: validDto.code, name: validDto.name }],
        rowCount: 1,
      });

      const response = await request(app)
        .post('/api/warehouses')
        .send(validDto);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.code).toBe(validDto.code);
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it('should return 400 validation error if code or name is missing', async () => {
      const response = await request(app)
        .post('/api/warehouses')
        .send({
          location: 'Invalid',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 conflict if warehouse code already exists', async () => {
      // Mock findByCode -> returns existing warehouse
      mockQuery.mockResolvedValueOnce({
        rows: [mockWarehouse],
        rowCount: 1,
      });

      const response = await request(app)
        .post('/api/warehouses')
        .send({
          code: mockWarehouse.code,
          name: 'Name duplicate code',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('CONFLICT');
    });
  });

  describe('PUT /api/warehouses/:id', () => {
    const updateDto = {
      name: 'Kho Tổng Đã Cập Nhật',
      is_active: false,
    };

    it('should update an existing warehouse successfully', async () => {
      // Mock getById -> returns existing warehouse
      mockQuery.mockResolvedValueOnce({
        rows: [mockWarehouse],
        rowCount: 1,
      });

      // Mock update -> returns updated warehouse
      mockQuery.mockResolvedValueOnce({
        rows: [{ ...mockWarehouse, name: updateDto.name, is_active: false }],
        rowCount: 1,
      });

      const response = await request(app)
        .put('/api/warehouses/1')
        .send(updateDto);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateDto.name);
      expect(response.body.data.is_active).toBe(false);
    });

    it('should return 404 when trying to update non-existent warehouse', async () => {
      // Mock getById -> returns empty
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });

      const response = await request(app)
        .put('/api/warehouses/999')
        .send(updateDto);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/warehouses/:id', () => {
    it('should delete a warehouse successfully and return 204', async () => {
      // Mock getById -> returns existing warehouse
      mockQuery.mockResolvedValueOnce({
        rows: [mockWarehouse],
        rowCount: 1,
      });

      // Mock delete -> returns rowCount 1
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
        rows: [],
      });

      const response = await request(app).delete('/api/warehouses/1');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });
  });

  describe('Global Error Handlers', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/api/invalid-non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});
