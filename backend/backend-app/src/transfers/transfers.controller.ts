import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  findAll() {
    // returns array of transfers with sender, recipient, wallets, etc.
    return this.transfersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // returns a single transfer or throws NotFoundException
    return this.transfersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTransferDto) {
    // returns { transfer, fx, compliance }
    return this.transfersService.create(dto);
  }
}
