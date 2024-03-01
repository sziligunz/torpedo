import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { UserCrudService } from 'src/app/services/userCrud.service';

@Component({
    selector: 'app-leaderboards',
    templateUrl: './leaderboards.component.html',
    styleUrls: ['./leaderboards.component.css']
})
export class LeaderboardsComponent implements AfterViewInit {

    @ViewChild("playerPaginator") playerPaginator!: MatPaginator
    playerData!: MatTableDataSource<User>
    paginatorLength: number = 0
    paginatorIndex: number = 0
    user: User | undefined

    constructor(
        public authService: AuthService,
        private userCrudService: UserCrudService
    ) {
        this.authService.getCurrentUser().then(userId => {
            this.userCrudService.getLoggedInUser(userId).then(user => {
                if (user) {
                    const buff = user
                    buff!.email = ''
                    buff!.id = ''
                    this.user = buff
                }
            })
        })
    }

    ngAfterViewInit(): void {
        this.getUsers()
        this.playerPaginator.page.subscribe(() => this.getUsers())
    }

    private first = true
    getUsers() {
        const pageIndex = this.playerPaginator.pageIndex
        const pageSize = this.playerPaginator.pageSize
        const res = this.userCrudService.getGlobalRankingUsers("userStatistics.numberOfWins", pageIndex*pageSize, pageSize)
        res.length.then(length => {
            res.data.then(data => {
                this.playerData = new MatTableDataSource(data)
                this.paginatorLength = length
                this.paginatorIndex = pageIndex
                if (this.first) { this.playerData.paginator = this.playerPaginator; this.first = false }
            })
        })
    }

}
