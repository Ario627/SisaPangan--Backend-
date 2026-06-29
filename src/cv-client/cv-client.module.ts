import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { CvClientService } from "./cv-client.service";

@Module({
    imports: [HttpModule],
    providers: [CvClientService],
    exports: [CvClientService],
})
export class CvClientModule {}