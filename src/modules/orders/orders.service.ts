import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entitys/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Create New Order
   * @param createOrderDto
   * @returns New Order
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const existing = await this.orderRepository.findOne({
      where: { trackingNumber: createOrderDto.trackingNumber },
    });

    if (existing) {
      throw new ConflictException(
        `Order with Tracking Number ${createOrderDto.trackingNumber} Already Exist`,
      );
    }

    const newOrder = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(newOrder);
  }

  /**
   * Get All Orders
   * @returns Orders
   */
  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      order: { createdAt: 'DESC' }, //For new to old
    });
  }

  /**
   * Get SIngle Order
   * @param id Of Order
   * @returns Order
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order With Id ${id} Not Found`);
    }
    return order;
  }

  /**
   * Update Order
   * @param id Order
   * @param updateOrderDto Data Updated
   * @returns Updated Order
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.preload({
      id: id,
      ...updateOrderDto,
    });

    if (!order) throw new NotFoundException(`Order with ${id} Not Found`);
    return await this.orderRepository.save(order);
  }

  /**
   * Delete Order
   * @param id Of Order
   * @returns Message Delete
   */
  async delete(id: number): Promise<{ message: string }> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
    return { message: `Order #${id} deleted successfully` };
  }
}
