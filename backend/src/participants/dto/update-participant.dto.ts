import { PartialType } from "@nestjs/mapped-types";
import { CreateParticipantDto } from "./CreateParticipantDto";

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {}
