import {UserMongoRepository} from "./users/repository/userMongoRepository";
import {UserMongoQueryRepository} from "./users/repository/userMongoQueryRepository";
import {UserService} from "./users/services/userService";
import {BlogMongoRepository} from "./blogs/repository/blogMongoRepository";
import {BlogMongoQueryRepository} from "./blogs/repository/blogMongoQueryRepository";
import {PostMongoQueryRepository} from "./posts/repository/postMongoQueryRepository";
import {PostService} from "./posts/services/postService";
import {BlogService} from "./blogs/services/blogService";
import {PostMongoRepository} from "./posts/repository/postMongoRepository";
import {CommentMongoRepository} from "./comments/repository/commentMongoRepository";
import {CommentMongoQueryRepository} from "./comments/repository/commentMongoQueryRepository";
import {CommentService} from "./comments/services/commentService";
import {UserDeviceMongoRepository} from "./security/repository/userDeviceMongoRepository";
import {ApiAccessLogsMongoRepository} from "./auth/repository/apiAccessLogsMongoRepository";
import {RevokedTokenMongoRepository} from "./auth/repository/revokedTokenMongoRepository";
import {AuthService} from "./auth/services/authService";
import {SecurityService} from "./security/services/securityService";
import {UserDeviceMongoQueryRepository} from "./security/repository/userDeviceMongoQueryRepository";
import {TestingRepository} from "./testing/repository/testingRepository";
import {TestingService} from "./testing/services/testingService";


// repositories
const blogMongoRepository: BlogMongoRepository = new BlogMongoRepository()
const blogMongoQueryRepository: BlogMongoQueryRepository = new BlogMongoQueryRepository()

const postMongoRepository: PostMongoRepository = new PostMongoRepository()
const postMongoQueryRepository: PostMongoQueryRepository = new PostMongoQueryRepository()

const commentMongoRepository: CommentMongoRepository = new CommentMongoRepository()
const commentMongoQueryRepository: CommentMongoQueryRepository = new CommentMongoQueryRepository()

const userMongoRepository: UserMongoRepository = new UserMongoRepository()
const userMongoQueryRepository: UserMongoQueryRepository = new UserMongoQueryRepository()

const userDeviceMongoRepository: UserDeviceMongoRepository = new UserDeviceMongoRepository()
const userDeviceMongoQueryRepository: UserDeviceMongoQueryRepository = new UserDeviceMongoQueryRepository()

const apiAccessLogsMongoRepository: ApiAccessLogsMongoRepository = new ApiAccessLogsMongoRepository()
const revokedTokenMongoRepository: RevokedTokenMongoRepository = new RevokedTokenMongoRepository()

const testingRepository: TestingRepository = new TestingRepository()

// services
const blogService: BlogService = new BlogService()
const postService: PostService = new PostService()
const commentService: CommentService = new CommentService()
const userService: UserService = new UserService()
const authService: AuthService = new AuthService()
const securityService: SecurityService = new SecurityService()
const testingService: TestingService = new TestingService()
