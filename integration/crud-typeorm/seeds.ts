import { ClassType } from '@nestjsx/util';
import { plainToClass } from 'class-transformer';
import { MigrationInterface, Repository, QueryRunner } from 'typeorm';
import { Company } from './companies';
import { Project, UserProject } from './projects';
import { Name, User } from './users';
import { License, UserLicense } from './users-licenses';
import { UserProfile } from './users-profiles';
import { Note } from './notes';

export class Seeds1544303473346 implements MigrationInterface {
  private save<T>(repo: Repository<T>, data: Partial<T>[]): Promise<T[]> {
    return repo.save(
      data.map((partial: Partial<T>) =>
        plainToClass<any, any>(repo.target as ClassType<T>, partial, {
          ignoreDecorators: true,
        }),
      ),
    );
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    const { connection } = queryRunner;

    const companiesRepo = connection.getRepository(Company);
    const projectsRepo = connection.getRepository(Project);
    const usersProfilesRepo = connection.getRepository(UserProfile);
    const usersRepo = connection.getRepository(User);
    const licensesRepo = connection.getRepository(License);
    const usersLincesesRepo = connection.getRepository(UserLicense);
    const usersProjectsRepo = connection.getRepository(UserProject);
    const notesRepo = connection.getRepository(Note);

    // companies
    await this.save(companiesRepo, [
      { name: 'Name1', domain: 'Domain1' },
      { name: 'Name2', domain: 'Domain2' },
      { name: 'Name3', domain: 'Domain3' },
      { name: 'Name4', domain: 'Domain4' },
      { name: 'Name5', domain: 'Domain5' },
      { name: 'Name6', domain: 'Domain6' },
      { name: 'Name7', domain: 'Domain7' },
      { name: 'Name8', domain: 'Domain8' },
      { name: 'Name9', domain: 'Domain9', deletedAt: new Date() },
      { name: 'Name10', domain: 'Domain10' },
    ]);

    // projects
    await this.save(projectsRepo, [
      { name: 'Project1', description: 'description1', isActive: true, companyId: 1 },
      { name: 'Project2', description: 'description2', isActive: true, companyId: 1 },
      { name: 'Project3', description: 'description3', isActive: true, companyId: 2 },
      { name: 'Project4', description: 'description4', isActive: true, companyId: 2 },
      { name: 'Project5', description: 'description5', isActive: true, companyId: 3 },
      { name: 'Project6', description: 'description6', isActive: true, companyId: 3 },
      { name: 'Project7', description: 'description7', isActive: true, companyId: 4 },
      { name: 'Project8', description: 'description8', isActive: true, companyId: 4 },
      { name: 'Project9', description: 'description9', isActive: true, companyId: 5 },
      { name: 'Project10', description: 'description10', isActive: true, companyId: 5 },
      { name: 'Project11', description: 'description11', isActive: false, companyId: 6 },
      { name: 'Project12', description: 'description12', isActive: false, companyId: 6 },
      { name: 'Project13', description: 'description13', isActive: false, companyId: 7 },
      { name: 'Project14', description: 'description14', isActive: false, companyId: 7 },
      { name: 'Project15', description: 'description15', isActive: false, companyId: 8 },
      { name: 'Project16', description: 'description16', isActive: false, companyId: 8 },
      { name: 'Project17', description: 'description17', isActive: false, companyId: 9 },
      { name: 'Project18', description: 'description18', isActive: false, companyId: 9 },
      { name: 'Project19', description: 'description19', isActive: false, companyId: 10 },
      { name: 'Project20', description: 'description20', isActive: false, companyId: 10 },
    ]);

    // user-profiles
    await this.save(usersProfilesRepo, [
      { name: 'User1' },
      { name: 'User2' },
      { name: 'User3' },
      { name: 'User4' },
      { name: 'User5' },
      { name: 'User6' },
      { name: 'User7' },
      { name: 'User8' },
      { name: 'User9' },
      { name: 'User1' },
      { name: 'User1' },
      { name: 'User1' },
      { name: 'User1' },
      { name: 'User1' },
      { name: 'User1' },
      { name: 'User1' },
      { name: 'User1' },
      { name: 'User1' },
      { name: 'User1' },
      { name: 'User2' },
    ]);

    // users
    const name: Name = { first: null, last: null };
    const name1: Name = { first: 'firstname1', last: 'lastname1' };
    const name2: Name = { first: 'firstname2', last: 'lastname2' };
    await this.save(usersRepo, [
      { email: '1@email.com', isActive: true, companyId: 1, profileId: 1, name: name1 },
      { email: '2@email.com', isActive: true, companyId: 1, profileId: 2, name: name2 },
      { email: '3@email.com', isActive: true, companyId: 1, profileId: 3, name },
      { email: '4@email.com', isActive: true, companyId: 1, profileId: 4, name },
      { email: '5@email.com', isActive: true, companyId: 1, profileId: 5, name },
      { email: '6@email.com', isActive: true, companyId: 1, profileId: 6, name },
      { email: '7@email.com', isActive: false, companyId: 1, profileId: 7, name },
      { email: '8@email.com', isActive: false, companyId: 1, profileId: 8, name },
      { email: '9@email.com', isActive: false, companyId: 1, profileId: 9, name },
      { email: '10@email.com', isActive: true, companyId: 1, profileId: 10, name },
      { email: '11@email.com', isActive: true, companyId: 2, profileId: 11, name },
      { email: '12@email.com', isActive: true, companyId: 2, profileId: 12, name },
      { email: '13@email.com', isActive: true, companyId: 2, profileId: 13, name },
      { email: '14@email.com', isActive: true, companyId: 2, profileId: 14, name },
      { email: '15@email.com', isActive: true, companyId: 2, profileId: 15, name },
      { email: '16@email.com', isActive: true, companyId: 2, profileId: 16, name },
      { email: '17@email.com', isActive: false, companyId: 2, profileId: 17, name },
      { email: '18@email.com', isActive: false, companyId: 2, profileId: 18, name },
      { email: '19@email.com', isActive: false, companyId: 2, profileId: 19, name },
      { email: '20@email.com', isActive: false, companyId: 2, profileId: 20, name },
      { email: '21@email.com', isActive: false, companyId: 2, profileId: null, name },
    ]);

    // licenses
    await this.save(licensesRepo, [
      { name: 'License1' },
      { name: 'License2' },
      { name: 'License3' },
      { name: 'License4' },
      { name: 'License5' },
    ]);

    // user-licenses
    await this.save(usersLincesesRepo, [
      { userId: 1, licenseId: 1, yearsActive: 3 },
      { userId: 1, licenseId: 2, yearsActive: 5 },
      { userId: 1, licenseId: 4, yearsActive: 7 },
      { userId: 2, licenseId: 5, yearsActive: 1 },
    ]);

    // user-projects
    await this.save(usersProjectsRepo, [
      { projectId: 1, userId: 1, review: 'User project 1 1' },
      { projectId: 1, userId: 2, review: 'User project 1 2' },
      { projectId: 2, userId: 2, review: 'User project 2 2' },
      { projectId: 3, userId: 3, review: 'User project 3 3' },
    ]);

    // notes
    await this.save(notesRepo, [
      { revisionId: 1 },
      { revisionId: 1 },
      { revisionId: 2 },
      { revisionId: 2 },
      { revisionId: 3 },
      { revisionId: 3 },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
