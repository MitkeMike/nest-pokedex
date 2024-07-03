import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name) // Inject the pokemon model
    private readonly pokemonModel: Model<Pokemon> // Define the pokemon model type
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleError(error);
    }
  }

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    return this.pokemonModel.find()
      .limit(limit).
      skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(id: string) {
    let pokemon: Pokemon;

    // Check if the id is a number
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    }

    // Check if is a mongo ID
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    // Check for name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: id.toLocaleLowerCase().trim() });
    }

    //If pokemon is not found
    if (!pokemon) throw new NotFoundException(`Pokemon with id ${id} not found`);



    return pokemon;

  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    // Convert name to lowercase
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    // Using the findOne method to get the pokemon to update.
    const pokemon = await this.findOne(id);
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }

    let result;
    try {
      // Update the pokemon using the updateOne method.
      result = await this.pokemonModel.updateOne({ _id: pokemon._id }, { $set: updatePokemonDto });
    } catch (error) {
      this.handleError(error);
    }

    // Use the findById method to get the updated pokemon.
    const updatedPokemon = await this.pokemonModel.findById(pokemon._id);

    return updatedPokemon;
  }


  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }
    return;
  }

  private handleError(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.error(error);
    throw new InternalServerErrorException(`Can't update pokemon - Check Server logs`);
  }
}
