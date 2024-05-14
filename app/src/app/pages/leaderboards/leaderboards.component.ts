import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
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

    private currentSortBy: string = "numberOfWins"
    private currentDirection: ("asc" | "desc" | "") = "desc"
    @ViewChild(MatSort) playerSorter!: MatSort

    constructor(
        public authService: AuthService,
        private userCrudService: UserCrudService
    ) {
        this.authService.getCurrentUserObservable().subscribe(user => {
            if (user) {
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
        })
    }

    ngAfterViewInit(): void {
        new Promise(resolve => resolve(undefined)).then(() => {
            this.playerSorter.active = "numberOfWins"
            this.playerSorter.direction = "desc"
            this.playerSorter.sortChange.emit({active: "numberOfWins", direction: "desc"})
        })
        this.playerPaginator.page.subscribe(() => this.getUsers())
    }

    private first = true
    getUsers() {
        const pageIndex = this.playerPaginator.pageIndex
        const pageSize = this.playerPaginator.pageSize
        const res = this.userCrudService.getGlobalRankingUsers(`userStatistics.${this.currentSortBy}`, this.currentDirection, pageIndex*pageSize, pageSize)
        res.length.then(length => {
            res.data.then(data => {
                this.playerData = new MatTableDataSource(data)
                this.paginatorLength = length
                this.paginatorIndex = pageIndex
                if (this.first) {
                    this.playerData.paginator = this.playerPaginator
                    this.first = false
                }
            })
        })
    }

    sortPressed(event: Sort) {
        this.currentSortBy = event.active
        this.currentDirection = event.direction as ("asc" | "desc" | "")
        this.getUsers()
    }

}
