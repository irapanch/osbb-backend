import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { Apartment, ApartmentDocument } from '../schemas/apartment.schema';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectModel(Apartment.name)
    private readonly apartmentModel: Model<ApartmentDocument>,
  ) {}

  async create(createApartmentDto: CreateApartmentDto): Promise<Apartment> {
    const newApartment = new this.apartmentModel(createApartmentDto);
    return newApartment.save();
  }

  async findAll(): Promise<Apartment[]> {
    const result = await this.apartmentModel.find().exec();
    console.log('👉 Apartments:', result);
    return result;
  }

  async findOne(id: number): Promise<Apartment | null> {
    return this.apartmentModel.findOne({ _id: id }).exec();
  }

  async update(
    id: number,
    updateApartmentDto: UpdateApartmentDto,
  ): Promise<Apartment | null> {
    return this.apartmentModel
      .findOneAndUpdate({ _id: id }, updateApartmentDto, { new: true })
      .exec();
  }

  async remove(id: number): Promise<Apartment | null> {
    return this.apartmentModel.findOneAndDelete({ _id: id }).exec();
  }

  async createBulk(apartments: CreateApartmentDto[]): Promise<Apartment[]> {
    return this.apartmentModel.insertMany(apartments);
  }
}
