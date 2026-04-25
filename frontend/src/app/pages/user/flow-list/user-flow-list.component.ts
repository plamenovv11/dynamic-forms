import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlowService } from '../../../services/flow.service';
import { Flow } from '../../../models/models';

@Component({
  selector: 'app-user-flow-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-flow-list.component.html',
})
export class UserFlowListComponent implements OnInit {
  flows: Flow[] = [];
  error = '';

  constructor(private flowService: FlowService) {}
  ngOnInit() {
    this.flowService.getFlows().subscribe({
      next: (f) => this.flows = f,
      error: () => this.error = 'Failed to load flows',
    });
  }
}
