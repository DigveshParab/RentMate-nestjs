import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Response } from 'express';
import { CreateBookingDto } from './dto/create-booking.dto';
import { HttpStatus } from '@nestjs/common';
import { CheckAvailabilityDto } from './dto/check-availability.dto';

/*
Self Notes
Controller Tests are requred coz
- Test the HTTP layer: how requests are handled and responses sent
- Routing, status codes, structure of response	
- Mocks the service	
- Response object via res.status().json()	
- Simulates actual controller methods with DTOs and mock responses	
*/

describe('BookingsController', () => {
  // declaring a variable to hold the controller instance we can run tests against its methods.
  let controller: BookingsController;
  // Instead of calling the real service methods, just use dummy functions we control.
  let mockBookingService: { createBooking: jest.Mock,checkAvailability: jest.Mock  };

  // Create a mock Response object
  // mimics the real Express Response object.
  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    mockBookingService = {
      createBooking: jest.fn(),
      checkAvailability: jest.fn(),

    };

    // This creates a mini Nest app, but only with the controller and mocked service.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingService, // Anywhere BookingsService is used, inject this mock instead.
        },
      ],
    }).compile();

    // retrieves the instance of the controller from the testing module 
    // Without this, we wouldn’t be able to call methods like controller.createBooking(...) in tests
    controller = module.get<BookingsController>(BookingsController);
  });

  // checks that controller was correctly initialized by Nest
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /bookings/create', () => {
    describe("Success test",()=>{
      it('should return 200 OK and success message for valid booking', async () => {
        const dto: CreateBookingDto = {
          firstName: 'John',
          lastName: 'Doe',
          vehicleId: 1,
          startDate: '2025-06-05',
          endDate: '2025-06-10',
        };

        const mockRes = mockResponse();

        // Whenever createBooking() is called during the test, don’t run real logic — instead, 
        // just immediately return provided result:
        mockBookingService.createBooking.mockResolvedValue({
          error: false,
          message: 'Booking successful',
        });

        // calling the controller method createBooking() 
        // dto - the test booking data
        // mockRes → a fake Express response object that records how the controller responds.
        await controller.createBooking(dto, mockRes);

        // This checks that controller correctly called the service method createBooking() with the exact dto.
        // If the controller called createBooking() with wrong/missing data, app might behave incorrectly.
        expect(mockBookingService.createBooking).toHaveBeenCalledWith(dto);

        // It checks whether your controller set the HTTP status to 200 OK using res.status(...).
        // This makes sure the controller sends back the correct success status when the booking goes well.
        expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);

        // It checks that the controller sent the correct JSON response back to the client.
        // Even if service returns the right data, the controller must correctly pass it to res.json() — this test confirms that.
        expect(mockRes.json).toHaveBeenCalledWith({
          error: false,
          message: 'Booking successful',
        });
      });
    })

    describe("Failure test",()=>{
      it('should return 400 if booking fails', async () => {
        const dto: CreateBookingDto = {
          firstName: 'Jane',
          lastName: 'Doe',
          startDate: '2025-06-10',
          endDate: '2025-06-15',
          vehicleId: 2,
        };

        const mockRes = mockResponse();

        mockBookingService.createBooking.mockResolvedValue({
          error: true,
          message: 'Booking failed to create',
        });

        await controller.createBooking(dto, mockRes);

        expect(mockBookingService.createBooking).toHaveBeenCalledWith(dto);
        expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: true,
          message: 'Booking failed to create',
        });
      });

      it('should return 500 if service throws an error', async () => {
        const dto: CreateBookingDto = {
          firstName: 'Alice',
          lastName: 'Smith',
          startDate: '2025-06-12',
          endDate: '2025-06-18',
          vehicleId: 3,
        };

        const mockRes = mockResponse();

        mockBookingService.createBooking.mockImplementation(() => {
          throw new Error('Database failure');
        });

        await controller.createBooking(dto, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: true,
          message: 'Database failure',
        });
      });


    })
  });


  describe("POST /bookings/check_availability",()=>{
    describe("Success test",()=>{
      it('should return available = true when vehicle is not booked', async () => {
        const dto: CheckAvailabilityDto = {
          vehicleId: 1,
          startDate: '2025-06-10',
          endDate: '2025-06-15',
        };

        mockBookingService.checkAvailability.mockResolvedValue({ available: true });

        const result = await controller.checkAvailability(dto);

        expect(result).toEqual({
          error: false,
          available: true,
          message: 'Vehicle is available',
        });
      });

      it('should return available = false when vehicle is already booked', async () => {
        const dto: CheckAvailabilityDto = {
          vehicleId: 1,
          startDate: '2025-06-10',
          endDate: '2025-06-15',
        };

        mockBookingService.checkAvailability.mockResolvedValue({ available: false });

        const result = await controller.checkAvailability(dto);

        expect(result).toEqual({
          error: false,
          available: false,
          message: 'Vehicle is not available for the selected dates',
        });
      });
    })
  })
});
