import { IsIn, IsInt, Min } from 'class-validator'; // walidacja pol ataku

export class AttackUnitDto {
  @IsInt() // wymagany int
  @Min(1) // id > 0
  attackerId!: number; // uniqueId atakujacego

  @IsInt()
  @Min(1)
  defenderId!: number; // uniqueId broniacego

  @IsIn(['melee', 'ranged']) // dozwolone tryby
  mode: 'melee' | 'ranged' = 'melee'; // domyslnie walka wrecz
}
