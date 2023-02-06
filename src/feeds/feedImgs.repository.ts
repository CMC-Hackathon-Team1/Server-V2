import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FeedImgs } from "../common/entities/FeedImgs";

@Injectable()
export class FeedImgsRepository {
  save(feedImg: FeedImgs) {
    return this.feedImgTable.save(feedImg);
  }
  constructor(
    @InjectRepository(FeedImgs)
    private feedImgTable: Repository<FeedImgs>,
  ) {}
}