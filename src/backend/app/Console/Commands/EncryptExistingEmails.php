<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class EncryptExistingEmails extends Command
{
    protected $signature = 'users:encrypt-emails {--dry-run : 実際には更新せず確認のみ}';

    protected $description = '既存ユーザーの平文メールアドレスを暗号化する';

    public function handle()
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->info('ドライランモード: 実際の更新は行いません');
        }

        // 平文のメールアドレスを持つユーザーを取得
        // メールアドレスには必ず @ が含まれるが、暗号化されたデータには含まれない
        $users = DB::table('users')
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->where('email', 'LIKE', '%@%')
            ->get();

        if ($users->isEmpty()) {
            $this->info('暗号化が必要なメールアドレスはありません。');
            return Command::SUCCESS;
        }

        $this->info("暗号化対象: {$users->count()}件のユーザー");

        $bar = $this->output->createProgressBar($users->count());
        $bar->start();

        $encrypted = 0;
        $failed = 0;

        foreach ($users as $user) {
            try {
                if (!$dryRun) {
                    $encryptedEmail = Crypt::encryptString($user->email);
                    DB::table('users')
                        ->where('id', $user->id)
                        ->update(['email' => $encryptedEmail]);
                }
                $encrypted++;
            } catch (\Exception $e) {
                $failed++;
                $this->error("\nユーザーID {$user->id} の暗号化に失敗: {$e->getMessage()}");
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("完了: {$encrypted}件を暗号化" . ($dryRun ? '（予定）' : ''));
        if ($failed > 0) {
            $this->warn("失敗: {$failed}件");
        }

        return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
