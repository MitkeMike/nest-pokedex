import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

private readonly axios: AxiosInstance = axios;

  async executeSeed() {

    await this.pokemonModel.deleteMany({}); // Delete * from pokemon  
    const { data } = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: {name:string, no:number}[] = [];

    data.results.forEach(({name, url}) => {
      
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      pokemonToInsert.push({name, no});

    });

    //Multiple inserts
    this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed successfully!';
  }
}
