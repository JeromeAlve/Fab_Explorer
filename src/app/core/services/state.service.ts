import {Injectable} from '@angular/core';
import {Block, Tx} from '../models';


@Injectable()
export class StateService {
  // Data related state
  currentTransaction: Tx;
  currentBlock: Block;
}

