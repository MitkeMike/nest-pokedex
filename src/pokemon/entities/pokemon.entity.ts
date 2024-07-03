import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document{

    @Prop({
        unique: true,
        required: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        required: true,
        index: true,
    })
    no: number;
}

// This is the schema that will be used to create the collection in the database.
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);