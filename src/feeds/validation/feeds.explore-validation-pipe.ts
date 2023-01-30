import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ExploreOptions } from "../enum/expore-options-enum";

export class feedExploreValidationPipe implements PipeTransform{
    
    readonly Options=[
        ExploreOptions.EXPLORE,
        ExploreOptions.FOLLOWING
    ];

    transform(value : any, metadata : ArgumentMetadata){
        if(!value){
            throw new BadRequestException(`query string 'option' is required. you must send EXPLORE or FOLLOWING`)
        }
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`${value} isn't in the status options`)
        }
        return value;
    }

    private isStatusValid(status: any){
        const index = this.Options.indexOf(status);
        return index !== -1;
    }
}