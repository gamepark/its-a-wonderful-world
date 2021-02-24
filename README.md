# It’s a Wonderful World for Game Park

This is the implementation of board game "It’s a Wonderful World" for Game Park (https://game-park.com/)

### Deployment
First you must configure rclone (https://rclone.org/).

Download rclone, and make it executable (add rclone.exe in the PATH env variable on Windows)

Then, run:

```
rclone config
> n (For "New remote)
name> its-a-wonderful-world
Storage> 4 (Amazon S3 Compliant Storage Provider)
provider> Other
env_auth> false
access_key_id> [Enter your access key id here - Never commit that on Git!]
secret_access_key> [Enter you secret access key here - Never commit that on Git!]
region> [Leave empty]
endpoint> cellar-c2.services.clever-cloud.com
location_constraint> [Leave empty]
acl> public-read
Edit advanced config> n
```

This configuration is only required once.
Now, to deploy a new version of It’s a Wonderful World, you have 2 command lines to run:

```
yarn build
rclone sync app/build its-a-wonderful-world:its-a-wonderful-world.game-park.com --progress --s3-acl=public-read
```

More details about this deployment method here: https://www.clever-cloud.com/blog/engineering/2020/06/24/deploy-cellar-s3-static-site/
