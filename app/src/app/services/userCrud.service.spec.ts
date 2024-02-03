import { TestBed } from '@angular/core/testing';

import { UserCrudService } from './userCrud.service';

describe('FirestoreService', () => {
    let service: UserCrudService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UserCrudService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
