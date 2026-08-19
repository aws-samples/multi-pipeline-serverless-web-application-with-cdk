# Multi pipeline Serverless Web Application with AWS CDK

이 프로젝트를 통해서 여러분은 인프라팀, 개발팀이 별도로 관리하는 여러 개의 파이프라인을 가진 서버리스 웹 애플리케이션을 구축할 수 있습니다.
이 프로젝트를 프로비저닝 함으로써 서버리스 아키텍처가 기존의 아키텍처와 동일하게 작동하는 하는 지를 확인할 수 있고 경험할 수 있습니다.
또한 AWS CDK가 가진 장점과 활용하는 방법에 대해서 알아볼 수 있습니다.

## Table of Contents
  - [Architecture](#Architecture)
  - [Scenario (Overall summary)](#Scenario-Overall-summary)
  - [CDK Tree data structure](#CDK-Tree-data-structure)
  - [이 프로젝트를 통해 확인할 수 있는 것](#이-프로젝트를-통해-확인할-수-있는-것)
  - [Deployment time](#Deployment-time)
  - [Pre Requisite](#Pre-Requisite)
  - [Set up the Project](#Set-up-the-Project)
  - [Verify deployment](#Verify-deployment)
  - [전체 흐름과 상세 내용](#전체-흐름과-상세-내용)
  - [Used AWS Services and Pricing](#Used-AWS-Services-and-Pricing)
  - [Clean up](#Clean-up)
  - [Appendix](#Appendix)
  - [그 밖의 추가적인 기능 살펴보기](#그-밖의-추가적인-기능-살펴보기)
  - [Optional extensions](#Optional-extensions)

## Architecture
![demo2-archi](./resource/demo2-archi.png)
- Serverless Architecture + Provisioned RDS, RDS Proxy

## Scenario (Overall summary)
단일 서비스에 대해서 개별적으로 리소스를 관리하는 세 개의 팀이 존재합니다.
1. Amazon S3, Amazon CloudFront, Amazon API Gateway 등을 비롯한 전반적 인프라 구성을 관리하는 인프라팀.
2. 인프라팀에서 구성해둔 API Gateway에 Amazon DynamoDB와 AWS Lambda를 사용해 서버리스 아키텍처를 사용하는 개발1팀.
3. 관계형 데이터베이스가 필요한 업무로 인해 Amazon RDS와 AWS Lambda를 사용하는 개발2팀.

이러한 세 개의 팀에 맞는 멀티 파이프라인 구조에 대한 구성은 아래의 이미지와 같습니다.
![demo2-pipeline](./resource/demo2-pipeline.png)

## CDK Tree data structure
![stackTree](./resource/stackTree.png)
- 메인 프레임에는 인프팀과 개발1팀이 하나의 CDK 파이프라인 내에서 구성하는 상황을 위해 하나의 app 루트를 가지게 구성되어 있습니다. 하지만 별도로 구분되는 스택 구조를 가지고 있어서 개별로 애플리케이션을 관리할 수 있습니다.      
또한 메인 프레임 스택에는 콘솔에서 수동으로 만든 람다를 API Gateway에 붙이고 권한을 부여하는 과정이 포함되어 있습니다.
- Devteam2에는 각 팀별로 CDK 파이프라인을 관리할 수 있도록 별도의 프로젝트로 구성하였고, 메인 프레임에서 생성한 CloudFront Construct 같은 것들을 참조할 수 있게 하였습니다. Devteam2의 경우는 비록 서버리스 아키텍처가 아니지만 특정한 상황으로 인해 관계형 데이터베이스를 갖도록 RDS MySQL을 사용합니다. (작은 규모의 Micro Service라고도 볼 수 있습니다.)

#### Main Frame
- MainFrame Stack
	1. S3 + CloudFront : WebHosting, Custom Error Response for Vue.js routing
	2. API Gateway : REST API, CORS
	3. Lambda : Attatch a manually created lambda

- Devteam1 Stack (Notice)
	1. DynamoDB : Create table, insert initial datas
	2. Lambda : get, post, delete

#### Devteam2 Frame
- Devteam2 Stack (Board)
	1. RDS : RDS proxy, insert initial datas
	2. Lambda : get, post, delete

## 이 프로젝트를 통해 확인할 수 있는 것
1. 서버리스 아키텍처 경험
	- AWS의 서버리스 서비스들을 활용한 구성을 바탕으로 서버리스 구조를 알아보고 동작하는 방식을 경험함니다.
	- 이 프로젝트에서는 Vue.js를 사용하였지만 이와 비슷한 리액티브 Front End를 정적 웹 호스팅할 수 있는 방법에 대해 알 수 있습니다.
	- *비록 RDS를 프로비저닝 하지만, 이는 특수한 상황을 가정한 경우로 만약 관계형 데이터베이스도 서버리스로 구성하길 원한다면 Amazon Aurora Serverless v2를 활용할 수도 있습니다.*
2. 익숙한 개발 언어인 Typescipt 사용한 손쉬운 인프라 관리 구성
	- 평소 자주 사용하던 개발 언어를 통해 IaC 환경을 구성하는 방법을 알아볼 수 있습니다.
	- 이 프로젝트에서는 Typescript를 바탕으로 작성되었습니다.
3. CDK를 통한 Lambda 배포 용이성
	- CDK 프로젝트에 Lambda 함수를 포함하여 배포함으로써 Lambda 생성과 소스를 함께 관리할 수 있습니다.
	- 외부 모듈을 참조해야 하는 경우 CDK를 사용하지 않는 경우에는 package.json, node_modules와 같은 것들을 함께 패키징하여 .zip 등으로 업로드해야 합니다.    
하지만 CDK에서 제공하는 aws-lambda-nodejs의 경우에는 nodejs lambda에 대해 필요한 모듈 구성으로만 번들링하고 배포까지 쉽게 진행할 수 있습니다.
	- Stack이나 Construct에 대한 변경이 없고 Lambda 함수에 대한 변경만 있는 경우 `cdk deploy --hotswap`을 통해 빠르게 배포할 수 있습니다.
4. CDK 스택 혹은 기존 리소스 간 연계 용이성
	- 이미 만들어진 리소스 혹은 다른 파이프라인 Stack에서 만든 리소스를 참조하고 해당 리소스에 추가로 연결 구성 가능합니다.
5. 인프라 구성 관리, 애플리케이션 서비스 구성 관리에 대한 파이프라인 분리
	- 각 조직의 규모와 특성에 따라 CDK를 활용한 파이프라인 구성을 참조하거나 응용하여 파이프라인 관리에 대한 인사이트를 얻을 수 있습니다.

## Deployment time
- Main-Frame : ~ 10 min.
- Devteam2-Frame : ~ 15min. 

## Pre Requisite
1. [AWS 계정 생성 및 사용자 생성](https://aws.amazon.com/ko/resources/create-account/)
	- <span style="color: red">CDK가 동작하기 위해서는 CDK에서 포함하고 있는 서비스에 대한 권한을 사용자가 가지고 있어야 합니다. 하지만 수행의 편의성을 위해 administrator 권한을 부여할 수 있으나 운영 환경에서는 지양해야 합니다.</span>
2. [전반적 설치 과정](https://aws.amazon.com/ko/getting-started/guides/setup-cdk/) - 상세 과정 및 방법 소개
	- local or AWS Cloud9, CLI, node, CDK Bootstrap에 관한 자세한 내용이 포함되어 있음
	- AWS Cloud9을 사용하는 경우 하기의 기본적인 설치 과정을 건너뛰고 빠르게 시작할 수 있습니다. (Cloud9 인스턴스가 소유한 Role에 위 1번에서 언급한 정책 부여 필요 - ex. Administrator policy)
3. AWS CLI - Version : aws-cli/2.7.14 Python/3.9.11 Darwin/20.6.0 exe/x86_64 prompt/off
4. node : v20 이상 (v22 LTS 권장). aws-cdk-lib 2.265.0이 Node >= 20을 요구합니다.
5. cdk 2.1137.0 or cdk 2.0 ~
6. Docker Install, 그리고 **phase 2 이전에 Docker 데몬을 실행**해야 합니다. `devteam2-frame`은 람다를 `aws-lambda-nodejs`(`NodejsFunction`)로 빌드하는데, 로컬에 `esbuild`가 없으면 Docker로 번들링합니다. Docker를 띄우지 않으려면 `devteam2-frame`에서 `npm install --save-dev esbuild`를 하면 로컬 번들링으로 처리됩니다.
7. RDS service-linked role 생성 권한. `devteam2-frame`은 RDS 인스턴스를 만들고, `AWSServiceRoleForRDS`가 없으면 CloudFormation이 생성에 실패합니다. 계정에서 RDS를 한 번도 만든 적이 없다면 배포 주체에 `rds.amazonaws.com`에 대한 `iam:CreateServiceLinkedRole` 권한이 필요합니다.
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "iam:CreateServiceLinkedRole",
                "Resource": "arn:aws:iam::*:role/aws-service-role/rds.amazonaws.com/AWSServiceRoleForRDS",
                "Condition": {
                    "StringLike": { "iam:AWSServiceName": "rds.amazonaws.com" }
                }
            }
        ]
    }
    ```
    [Amazon RDS의 서비스 연결 역할 사용](https://docs.aws.amazon.com/ko_kr/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.ServiceLinkedRoles.html) 참고.
8. 리전. 두 frame 모두 `config/shared.ts`의 `REGION`을 사용하고, 이 값은 CDK CLI가 AWS 프로파일에서 해석한 `CDK_DEFAULT_REGION`을 따릅니다. 다른 리전에 배포하려고 소스를 고칠 필요가 없습니다. CLI가 리전을 해석하지 못하면 `ap-northeast-2`로 폴백합니다.

    **두 frame이 같은 리전으로 해석되어야 합니다.** `devteam2-frame`은 `Fn.importValue`로 `main-frame`의 CloudFormation export를 읽는데 export는 리전 범위이므로, 리전이 갈리면 export를 찾지 못해 실패합니다.
9. CDK Bootstrap  
    ```shell
	$ ## Check account information
	$ aws sts get-caller-identity

	$ ## 위에서 나온 값 중 "Account" 뒤의 숫자가 아래의 ACCOUNT-NUMBER
	$ ## REGION은 AWS 프로파일이 해석하는 리전과 일치해야 합니다 (8번 항목 참고)
	$ cdk bootstrap aws://ACCOUNT-NUMBER/REGION
	```
![cdktoolkit](./resource/CDKToolkit.png)
	- 만약 CDK Toolkit이 Cloudformation에 보이지 않는 경우 프로젝트를 정상적으로 실행할 수 없으니 확인이 필요합니다.
10. [SAM Install](https://docs.aws.amazon.com/ko_kr/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html)
11. Lambda 생성
	- <span style="color: red">매뉴얼로 만든 'helloworld' 이름을 가진 Lambda를 CDK Stack에서 참조하고 이를 API Gateway에 연결합니다.</span>
![LambdaCreate](./resource/LambdaCreate.png)


## Set up the Project
- devteam2-frame을 시작하기 전에 main-frame이 먼저 완료되어야 합니다.
- AWS Cloud9을 사용하는 경우 꼭 EBS 볼륨 용량을 늘려줘야 합니다. (기본 10GB이므로 20GB로 늘려줍니다. 아래 단계 과정 중 안내에 따라 진행)  
![awsConfigure](./resource/awsConfigure.png)
```shell
$ git clone https://github.com/aws-samples/multi-pipeline-serverless-web-application-with-cdk
$ cd multi-pipeline-serverless-web-application-with-cdk
$ 
$ # If you are using Cloud9 Do this
$ chmod +x resize.sh
$ ./resize.sh 20
$ 
$ cd main-frame
$ npm install
$ cdk deploy --all --outputs-file ./cdk-outputs.json # type y if ask soemthing, takes about 10 min.
$ # If there is error, please check belows
$ # 1. cdk bootstrap aws://ACCOUNT-NUMBER/REGION
$ # 2. Did you make lambda name with 'helloword'
$ 
$ # wait to complete main-frame
$ cd ../devteam2-frame
$ npm install
$ cdk deploy --all --outputs-file ./cdk-outputs.json # type y if ask soemthing, takes about 10~15 min.
```

## Verify deployment
1. CDK에서 생성된 리소스 확인  
![checkResource](./resource/checkResource.png)
2. CloudFormation > MainFrameStack > CFDomainName link  
![mainframOutput](./resource/mainframOutput.png)
3. S3 + CloudFront를 통해 호스팅되는 웹 페이지 접속 확인  
![mainPage](./resource/mainPage.png)
4. API Gateway를 통해 DynamoDB와 RDS MySQL로부터 조회되는 데이터 확인
![dataCheck](./resource/dataCheck.png)
5. 데이터 삭제  
![dataDelete](./resource/dataDelete.png)
6. 데이터 적재  
![dataInsert](./resource/dataInsert.png)
7. 적재 데이터 확인  
![dataCheck2](./resource/dataCheck2.png)

## 전체 흐름과 상세 내용
1. CDK Deploy
2. S3 + CloudFront
	- 프로젝트 내에 빌드된 정적 객체들 포함
	- S3에 업로드되는 정적 객체들은 Vue.js를 통해 개발되고 빌드된 객체
	- CORS 설정 및 SPA Front End를 위한 라우팅 설정
3. API Gateway
	- 리소스 생성, 메소드 생성 및 기존 생성된 Lambda 연결 (Lambda 이름을 통한 주입)
	- Response에 대한 CORS 설정
	- DynamoDB를 사용하는 개발1팀의 Lambda 연결 (GET, POST, DELETE)
	- RDS MySQL을 사용하는 개발2팀의 Lambda 연결 (GET, POST, DELETE)
		- API Gateway 연결 시 같은 파이프라인 내에서 생성되지 않았으나, CfnOutput을 통해 생성된 정보 값을 통해 개발2팀의 프로젝트에서도 이를 참조하고 사용
4. AWS Lambda
	- API Gateway에 Proxy Integration되며 Back End 역할 수행. Request를 DB에 전달하고 다시 Reponse로 전달
	- Frnt End에서 필요한 API Gateway URL 정보값을 S3 웹호스팅 경로에 생성
	- DynamoDB 생성 후 초기 기본 데이터를 DynamoDB에 생성
	- RDS MySQL 생성 후 초기 기본 데이터를 MySQL에 생성
5. Amazon DynamoDB
	- RCU, WCU 5에 해당되는 DynamoDB
	- Partition Key: id, Sort Key: title
	- DynamoDB 생성 후 Lambda가 세 건의 데이터 생성
6. Amazon RDS
	- T3, Large 인스턴스. 단일 AZ
	- 순차적으로 증가하는 id를 Primary Key로 가지며 title, date 컬럼 존재
	- RDS 생성 후 Lambda가 세 건의 데이터 생성
7. Amazon RDS Proxy
	- Lambda에서 프로비저닝된 RDS에 직접 연결을 구성하게 될 경우 DB connection 소모량이 많아 문제가 될 수 있으므로 이를 처리할 수 있게 하기 위한 RDS PRoxy 생성
	- Lambda가 RDS Proxy Endpoint를 통해 데이터 쿼리
8. AWS Secrets Manager
	- DB 이름, 비밀번호 등 RDS 연결에 필요한 정보를 Secrets Manager에 등록해두고 API 호출하여 사용함으로써 소스 코드 내에 하드 코딩으로 인한 보안 취약성 제거
9. **AWS에서 서비스 연결 구성 시 공통적으로 다른 서비스에 대한 사용 권한을 소유해야 하지만, 이러한 과정들을 CDK에서 제공하는 기능 호출을 통해 비교적 쉽게 구성 가능**

## Used AWS Services and Pricing
1. [Amazon S3](https://aws.amazon.com/ko/s3/pricing/)
2. [Amazon CloudFront](https://aws.amazon.com/ko/cloudfront/pricing/)
3. [Amazon API Gateway](https://aws.amazon.com/ko/api-gateway/pricing/)
4. [AWS Lambda](https://aws.amazon.com/ko/lambda/pricing/)
5. [Amazon DynamoDB](https://aws.amazon.com/ko/dynamodb/pricing/)
6. [Amazon RDS](https://aws.amazon.com/ko/rds/pricing/)
7. [Amazon RDS Proxy](https://aws.amazon.com/ko/rds/proxy/pricing/)
8. [AWS Secrets Manager](https://aws.amazon.com/ko/secrets-manager/pricing/)

## Clean up
```shell
$ cd devteam2-frame
$ cdk destroy --all # it takes about 10~15 min.
$ cd ../main-frame
$ cdk destroy --all # it takes about ~10 min.
```
- <span style="color: red">모든 리소스를 정리한 후 CloudFormation에 존재하는 `CDKToolkit`도 꼭 함께 정리해야 합니다. 정리하지 않은 경우 KMS를 사용하기 때문에 월 1$의 비용이 청구될 수 있습니다.</span>
- Cloud9을 사용한 경우 Cloud9에 대해서도 모두 종료합니다.

----
## Appendix
### Lambda Hotswap, SAM Lambda Test, CDK Pipeline
#### CDK Hotswap
- Hotswap은 프로젝트 내에 lambda 소스에 대한 변경만 있는 경우 전체 Stack을 배포하지 않고 Lambda에 대한 변경 분만 배포를 진행합니다. 이를 사용하여 Lambda 배포 시간을 단축할 수 있습니다.    
(하지만 Stack에 변경된 내용은 없으므로 Stack에 대한 변경/재배포가 반영되지는 않습니다.)
- 아래와 같은 순서로 이 기능을 테스트해볼 수 있습니다.

1. main-frame/lambda/notices/getOne/index.js 13번 줄에 `console.log('hotswap test);` 추가 후 저장
```javascript
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,access-token"
};

exports.handler = async (event, context) => {
    const itemId = event.pathParameters.id;
    const titleParam = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    console.log('hotswap test');	// add here for test
    
```

2. 배포 과정 및 시간 확인 - Lambda Function Stack update 수행
```shell
$ cd main-frame
$ cdk deploy --all --outputs-file ./cdk-outputs.json
```

3. main-frame/lambda/notices/getOne/index.js 13번 줄에 추가한 `console.log('hotswap test);` 제거 후 저장
```shell
$ cdk deploy --hotswap --all --outputs-file ./cdk-outputs.json
```

4. Lambda Stack과 관련한 대한 배포가 진행되지 않고 빠른 속도로 Lambda가 배포되는 것을 볼 수 있습니다.

#### SAM Lambda Local Test
- Local Test를 위해 사용할 Lambda를 준비해두었으며 경로는 다음과 같습니다   
main-frame/lambda/lambdaLocalTest/index.js  : Lambda 함수 코드   
main-frame/lib/app-construct/lambdaLocalTest.ts : Lambda를 생성하기 위한 Construct, main-frame에서 선언 및 호출됨.   
```javascript
exports.handler = async (event) => {
    console.log('this is the Lambda Local testing');
    console.log('how to local test is up to you');
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
```

1. 다음의 경로를 따라 Main-Frame 디렉터리로 이동
```shell
$ cd main-frame
$ cdk synth --all # this makes cfn template through cdk source code
$ # after then under the cdk.out, You can find templates.
```

2. main-frame/cdk.out/MainFrameStack.template.json을 열어보면 `LambdaLocalTest`가 생성된 것을 확인 가능.   
![testLocal](./resource/testlocalLambda.png)

3. 이 정보를 바탕으로 Lambda를 Deploy하지 않고 Local에서 실행 (Docker 기반)
```shell
$ cd main-frame
$ # sam local invoke [OPTIONS] [STACK_NAME/FUNCTION_IDENTIFIER]
$ sam local invoke -t ./cdk.out/MainFrameStack.template.json lambdaLocalTest
```
   
![lambdaExecute](./resource/lambdaExecute.png)

4. 이 처럼 SAM을 통해 local에서 수행 가능한 기능과 옵션들이 여럿 제공되고 있으며 이 페이지 가장 아래쪽에 관련된 명령어가 나열되어 있습니다.   



## 그 밖의 추가적인 기능 살펴보기
1. AWS CDK Workshop
	- [Local API Gateway](https://docs.aws.amazon.com/ko_kr/serverless-application-model/latest/developerguide/serverless-sam-cli-using-start-api.html)
2. DynamoDB Local
	- [Install DynamoDB on local](https://docs.aws.amazon.com/ko_kr/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
3. CDK Pipeline
	- [CDK Pipeline Workshop](https://cdkworkshop.com/20-typescript/70-advanced-topics/200-pipelines.html)

 

### Lambda Local Test - SAM
* `cdk synth --no-staging > tamplate.yml`

### Invoke the function FUNCTION_IDENTIFIER declared in the stack STACK_NAME
* `sam local invoke [OPTIONS] [STACK_NAME/FUNCTION_IDENTIFIER]`

### Start all APIs declared in the AWS CDK application
* `sam local start-api -t ./cdk.out/CdkSamExampleStack.template.json [OPTIONS]`

### Start a local endpoint that emulates AWS Lambda
* `sam local start-lambda -t ./cdk.out/CdkSamExampleStack.template.json [OPTIONS]`

### example
* `sam local invoke -t ./cdk.out/Devteam2FrameStack.template.json boardGet`


## Optional extensions

issue #10의 요청 사항에 대한 답입니다. 모두 opt-in이며, 아무것도 적용하지 않아도
샘플은 그대로 배포됩니다.

### API를 Cognito로 보호하기

`main-frame`에는 이미 `CognitoConstruct`(user pool, SRP 인증을 쓰는 user pool
client, hosted domain)가 있고, `MainFrameStack`에 주석 3줄로 연결돼 있습니다.
`main-frame/stack/main-frame-stack.ts`에서 주석을 해제하면 됩니다.

```ts
import { CognitoConstruct } from '../lib/infra-constructs/cognito-construct/cognito-construct';
// ...
const cognitoUserPools = new CognitoConstruct(this, 'CognitoUserPool', {});
// ...
const apiRscMethod = new ApiRscMethod(this, 'apiRdcMethod', {
  apiGW: this.apiGwConstruct.apiGW,
  cognitoUserPool: cognitoUserPools.userPool,
});
```

`cognitoUserPool`은 `ApiGWContructProps`의 옵션 프로퍼티입니다. 넘기면
`ApiRscMethod`가 `GET /temporary` 메서드에 `CognitoUserPoolsAuthorizer`를
붙이고, 넘기지 않으면 메서드는 열린 상태로 남으며 합성된 템플릿은 기본값과
바이트 단위로 동일합니다. 활성화하면 호출 측에서 user pool ID 토큰을
`Authorization` 헤더로 보내야 합니다.

hosted domain prefix는 `CONSTANTS.PROJECT_NAME`에서 파생되며(`cdkdemo-app`),
Cognito domain prefix는 전역적으로 유일해야 합니다. 배포 시 prefix가 이미
사용 중이라고 나오면 `config/shared.ts`의 `PROJECT_NAME`을 바꾸면 됩니다.

`cognito-construct.ts` 안의 `CfnIdentityPool` 블록은 주석 상태로 둡니다. 브라우저
클라이언트가 IAM 역할을 assume해서 AWS API를 직접 호출해야 할 때만 필요하고,
이 샘플은 그렇게 동작하지 않습니다.

### 람다에 추가 npm 모듈을 번들링하기

`aws-lambda-nodejs`가 바로 이 용도이고, `devteam2-frame`이 이미 사용하고
있습니다. `devteam2-frame/lib/app-construct/createTable-lambda.ts`를 보세요.

```ts
const createTableLambda = new nodeLambda.NodejsFunction(this, 'createTableLambda', {
  entry: path.join(__dirname, '/../../lambda/boards/createTable/index.js'),
  bundling: {
    nodeModules: ['mysql2'],
  },
});
```

`nodeModules`는 esbuild가 인라인하지 않고 번들에 설치해야 하는 패키지를
지정합니다. 먼저 해당 frame의 `package.json`에 의존성을 추가하고 여기에
나열합니다. 결제 SDK도 방식이 같습니다. `devteam2-frame/package.json`에
`stripe`를 추가하고 `nodeModules`에 `stripe`를 넣은 뒤 핸들러에서
`require('stripe')` 하면 됩니다.

함께 알아둘 만한 옵션 두 개가 있습니다.

- `externalModules`는 패키지를 번들에서 아예 제외합니다. Lambda 런타임이 이미
  제공하는 것에 씁니다. Node 18 이상에서는 AWS SDK v3(`@aws-sdk/*`)이며 v2가
  아닙니다. CDK가 이 런타임들에 대해 이미 `['@aws-sdk/*']`를 기본값으로 두기
  때문에, 핸들러가 어느 `package.json`에도 없는 SDK 클라이언트를 require할 수
  있습니다. 번들이 아니라 런타임에서 해석되기 때문입니다. SDK 버전을 직접
  고정하고 싶으면 `bundleAwsSDK: true`를 주면 되고, AWS는 운영 환경에는 이 쪽을
  권장합니다.
- `forceDockerBundling: true`는 로컬 `esbuild`가 있어도 Docker 번들링을
  강제합니다. 네이티브 바인딩이 있는 의존성을 로컬이 아니라 Lambda 플랫폼에
  맞게 컴파일해야 할 때 유용합니다.

번들링에는 로컬 `esbuild` 또는 실행 중인 Docker 데몬이 필요합니다.
[Pre Requisite](#Pre-Requisite)의 6번 항목을 참고하세요.

### RDS 비밀번호 교체하기

`devteam2-frame`은 생성된 비밀번호를 담은 `db-credentials` Secrets Manager
시크릿을 만들고, RDS 인스턴스(`rds.Credentials.fromSecret(...)`)와 RDS
Proxy(`secrets: [...]`)가 모두 이 시크릿을 읽습니다. 현재 값 확인:

```shell
$ aws secretsmanager get-secret-value --secret-id db-credentials \
    --query SecretString --output text
```

**시크릿 값을 직접 수정하지 마세요.** RDS는 시크릿을 다시 읽지 않으므로 DB
비밀번호는 그대로인데 시크릿만 달라지고, 그 결과 RDS Proxy가 인스턴스 인증에
실패합니다.

제대로 교체하려면 Secrets Manager가 양쪽을 함께 바꾸게 해야 합니다.
`devteam2-frame/lib/rds-construct/rds-construct.ts`에서 `this.dbInstance`
생성 뒤에 한 줄을 추가하세요.

```ts
this.dbInstance.addRotationSingleUser({
  automaticallyAfter: cdk.Duration.days(30),
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  endpoint: this.secretManagerVpcEndpoint,
});
```

VPC 안에 rotation 람다를 프로비저닝하고 일정을 등록하므로, 인스턴스 비밀번호와
시크릿이 함께 바뀌고 서로 어긋나지 않습니다.

여기서 `endpoint`는 사실상 필수입니다. 이 VPC는 `natGateways: 0`으로 만들어지고
모든 서브넷이 `PRIVATE_ISOLATED`이므로 rotation 람다에는 퍼블릭 Secrets Manager
API로 가는 경로가 없습니다. construct가 만드는 인터페이스 엔드포인트를 거쳐야
하며, 바로 이 용도로 `secretManagerVpcEndpoint`로 노출해 두었습니다. `endpoint`를
빼면 rotation은 그대로 타임아웃됩니다.

문자 집합 관련 참고: 최초 시크릿은 `excludePunctuation: true`로 생성됩니다.
rotation은 자체 `excludeCharacters` 기본값을 쓰므로, 비밀번호에 구두점이 없어야
하는 곳이 있다면 명시적으로 지정하세요.

### 다루지 않은 것: 웹 앱 빌드 파이프라인

issue #10은 `main-frame/website-dist` 뒤의 Vue.js 소스와 빌드 워크플로도
요청합니다. 이는 이 CDK 샘플의 변경이 아니라 별도의 프론트엔드 프로젝트이고,
이 리포지토리에는 포함돼 있지 않습니다. `website-dist`는 빌드된 상태로
제공되며, `WriteWebhostEnvConstruct`가 배포 시점에 API Gateway 엔드포인트를
버킷에 기록하므로 정적 번들이 재빌드 없이 API를 찾을 수 있습니다.

### Useful commands - CDK

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
* `cdk deploy --all --outputs-file ./cdk-outputs.json`  deploy whole stack within a project
* `cdk deploy --hotswap`    quickly deploy lambda