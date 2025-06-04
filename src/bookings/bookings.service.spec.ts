import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';


/*
Self Notes
Service Tests are requred coz
- Test the core business logic: calculations, DB queries, validations
- Logic, edge cases, error handling, interactions with DB/services
- Usually mocks DB layer (e.g. Prisma) or external services
- Plain JavaScript/TypeScript object or value
- Direct function calls with varied inputs & mocks
*/


describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: PrismaService;


  const mockPrisma = {
    booking: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("createBooking",()=>{
    describe("Success test",()=>{
      it('should successfully create a booking', async () => {
          const dto = {
            firstName: 'John',
            lastName: 'Doe',
            vehicleId: 1,
            startDate: '2025-06-10',
            endDate: '2025-06-12',
          };

          const mockBookingResult = {
            id: 1,
            name: 'John Doe',
            vehicleId: 1,
            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
          };

          // When prisma.booking.create gets called in the service, instead of hitting DB, it just returns this mock result.
          mockPrisma.booking.create.mockResolvedValue(mockBookingResult);

          // Since Prisma is mocked, the create() method doesn't do real DB work — it returns the mock.
          const result = await service.createBooking(dto);

          // Confirms that service returns the right message.
          expect(result).toEqual({ error: false, message: 'Booking successful' });
          expect(mockPrisma.booking.create).toHaveBeenCalledWith({
            data: {
              name: dto.firstName + " " + dto.lastName,
              vehicleId: dto.vehicleId,
              startDate: new Date(dto.startDate),
              endDate: new Date(dto.endDate),
            },
          });
        });
      })

    describe("Failure test",()=>{
        it('should throw InternalServerErrorException if booking creation fails', async () => {
          const dto = {
            firstName: 'Jane',
            lastName: 'Smith',
            vehicleId: 2,
            startDate: '2025-07-01',
            endDate: '2025-07-03',
          };

          mockPrisma.booking.create.mockRejectedValue(new Error('DB error'));

          await expect(service.createBooking(dto)).rejects.toThrow(InternalServerErrorException);
          expect(mockPrisma.booking.create).toHaveBeenCalled();
        });

    })
  })


  describe("checkAvailability",()=>{
    describe("Success test",()=>{
      it('should return available: true when no overlapping booking exists', async () => {
        const dto = {
          vehicleId: 1,
          startDate: '2025-07-10',
          endDate: '2025-07-15',
        };

        mockPrisma.booking.findFirst.mockResolvedValue(null); // No overlapping booking

        const result = await service.checkAvailability(dto);

        expect(mockPrisma.booking.findFirst).toHaveBeenCalledWith({
          where: {
            vehicleId: dto.vehicleId,
            startDate: { lte: new Date(dto.endDate) },
            endDate: { gte: new Date(dto.startDate) },
          },
        });

        expect(result).toEqual({ available: true });
      });

      it('should return available: false when overlapping booking exists', async () => {
        const dto = {
          vehicleId: 2,
          startDate: '2025-07-20',
          endDate: '2025-07-25',
        };

        // Mock overlapping booking found
        mockPrisma.booking.findFirst.mockResolvedValue({ id: 99 });

        const result = await service.checkAvailability(dto);

        expect(mockPrisma.booking.findFirst).toHaveBeenCalledWith({
          where: {
            vehicleId: dto.vehicleId,
            startDate: { lte: new Date(dto.endDate) },
            endDate: { gte: new Date(dto.startDate) },
          },
        });

        expect(result).toEqual({ available: false });
      });


    })
  })

});
