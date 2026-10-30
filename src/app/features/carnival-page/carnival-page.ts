import { Component } from '@angular/core';
import { Carnival } from '../carnival/carnival';
import { Block } from '../../shared/components/block/block';

@Component({
  selector: 'app-carnival-page',
  imports: [Carnival, Block],
  templateUrl: './carnival-page.html',
})
export class CarnivalPage {

}
