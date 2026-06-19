import { ExactData, Tag } from "@unlockit/shared";
import { TagEntityDoc } from "src/docs/tags/entities/tag.entity.doc";

export class TagDto implements Tag {
    @TagEntityDoc.Id()
    id: number;

    @TagEntityDoc.Name()
    name: string;

    @TagEntityDoc.GamesCount()
    gamesCount: number;
}

const _assertExact: ExactData<Tag, TagDto> = true;