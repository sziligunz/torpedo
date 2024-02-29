import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { UserCrudService } from 'src/app/services/userCrud.service';

@Component({
    selector: 'app-leaderboards',
    templateUrl: './leaderboards.component.html',
    styleUrls: ['./leaderboards.component.css']
})
export class LeaderboardsComponent implements OnInit, AfterViewInit {

    @ViewChild("playerPaginator") playerPaginator!: MatPaginator
    playerData!: MatTableDataSource<User>

    constructor(
        public authService: AuthService,
        private userCrudService: UserCrudService
    ) {}

    ngAfterViewInit(): void {
        this.getUsers()
        this.playerPaginator.page.subscribe(() => this.getUsers())
    }

    ngOnInit(): void {
    }

    getUsers() {
        const pageIndex = this.playerPaginator.pageIndex
        const pageSize = this.playerPaginator.pageSize
        this.userCrudService.getGlobalRankingUsers("numberOfWins", pageIndex*pageSize, pageSize)
            .then(data => {
                this.playerData = new MatTableDataSource(data)
                this.playerData.paginator = this.playerPaginator
                console.log(data)
            })
    }

}
