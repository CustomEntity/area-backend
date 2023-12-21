/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import {Injectable, Logger} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {CommandBus} from "@nestjs/cqrs";
import {Octokit} from "@octokit/rest";
import {UserConnectionRepository} from "../../user-connections/ports/user-connection.repository";


@Injectable()
export class BullshitTask {

    private idLastCheckDate: { [id: string]: Date } = {};

    constructor(
        private readonly userConnectionRepository: UserConnectionRepository
    ) {
    }

    async handleCron() {
        //await this.commandBus.execute(new ScheduleAllAppletsExecutionCommand());
        const githubConnection = await this.userConnectionRepository.findByApplicationId('1');

        for (const connection of githubConnection) {
            const octokit = new Octokit({
                auth: (connection.connectionCredentials.value as { access_token: string }).access_token,
            });
            const {data} = await octokit.repos.listCommits({
                owner: 'CustomEntity',
                repo: 'test-js-repository',
            });

            const lastCheckDate = this.idLastCheckDate[connection.id];
            if (lastCheckDate) {
                const lastCommitDate = new Date(data[0]!.commit!.author!.date!);
                if (lastCommitDate > lastCheckDate) {
                    // Fetch post to pastebin api to create a new post with the content of the last commit
                    // https://pastebin.com/api

                    console.log('New commit detected', data[0]!.commit!.message!);
                    const createPastebin = await fetch('https://pastebin.com/api/api_post.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({
                            api_dev_key: 'dPLWl7bKQoc3WdH7apHQmH-nUIHjI3UK',
                            api_option: 'paste',
                            api_paste_code: data[0]!.commit!.message!,
                            api_paste_private: '1',
                                api_paste_name: data[0]!.commit!.author!.name!,
                                api_paste_expire_date: '1D',
                        }).toString()
                    });
                    const pastebinUrl = await createPastebin.text();
                    console.log('Pastebin url', pastebinUrl);
                    this.idLastCheckDate[connection.id] = new Date();
                }
            } else {
                this.idLastCheckDate[connection.id] = new Date();
            }



        }
    }
}