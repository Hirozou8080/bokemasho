<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class EncryptExistingEmailsTest extends TestCase
{
    use RefreshDatabase;

    public function test_平文のメールアドレスが暗号化される(): void
    {
        // Factoryでユーザー作成後、DBを直接更新して平文に戻す
        $user = User::factory()->create(['email' => 'test@example.com']);
        DB::table('users')->where('id', $user->id)->update(['email' => 'test@example.com']);

        // コマンド実行
        $this->artisan('users:encrypt-emails')
            ->expectsOutput('暗号化対象: 1件のユーザー')
            ->assertSuccessful();

        // DBから直接取得して暗号化されているか確認
        $rawEmail = DB::table('users')->where('id', $user->id)->value('email');
        $this->assertStringNotContainsString('@', $rawEmail);

        // Modelを通して取得すると復号される
        $decryptedUser = User::find($user->id);
        $this->assertEquals('test@example.com', $decryptedUser->email);
    }

    public function test_すでに暗号化済みのメールアドレスはスキップされる(): void
    {
        // Factoryで作成（emailは自動的に暗号化される）
        User::factory()->create();

        // コマンド実行
        $this->artisan('users:encrypt-emails')
            ->expectsOutput('暗号化が必要なメールアドレスはありません。')
            ->assertSuccessful();
    }

    public function test_複数ユーザーの平文メールアドレスが暗号化される(): void
    {
        // Factoryで複数ユーザー作成後、DBを直接更新して平文に戻す
        $user1 = User::factory()->create(['email' => 'user1@example.com']);
        $user2 = User::factory()->create(['email' => 'user2@example.com']);
        DB::table('users')->where('id', $user1->id)->update(['email' => 'user1@example.com']);
        DB::table('users')->where('id', $user2->id)->update(['email' => 'user2@example.com']);

        // コマンド実行
        $this->artisan('users:encrypt-emails')
            ->expectsOutput('暗号化対象: 2件のユーザー')
            ->assertSuccessful();

        // 両方暗号化されているか確認
        $decryptedUser1 = User::find($user1->id);
        $decryptedUser2 = User::find($user2->id);
        $this->assertEquals('user1@example.com', $decryptedUser1->email);
        $this->assertEquals('user2@example.com', $decryptedUser2->email);

        // DBの生データには@が含まれない
        $rawEmail1 = DB::table('users')->where('id', $user1->id)->value('email');
        $rawEmail2 = DB::table('users')->where('id', $user2->id)->value('email');
        $this->assertStringNotContainsString('@', $rawEmail1);
        $this->assertStringNotContainsString('@', $rawEmail2);
    }

    public function test_ドライランモードではDBが更新されない(): void
    {
        // Factoryでユーザー作成後、DBを直接更新して平文に戻す
        $user = User::factory()->create(['email' => 'dryrun@example.com']);
        DB::table('users')->where('id', $user->id)->update(['email' => 'dryrun@example.com']);

        // ドライランモードでコマンド実行
        $this->artisan('users:encrypt-emails --dry-run')
            ->expectsOutput('ドライランモード: 実際の更新は行いません')
            ->assertSuccessful();

        // メールアドレスが平文のままであることを確認
        $rawEmail = DB::table('users')->where('id', $user->id)->value('email');
        $this->assertEquals('dryrun@example.com', $rawEmail);
    }

    public function test_ユーザーがいない場合は処理をスキップする(): void
    {
        $this->artisan('users:encrypt-emails')
            ->expectsOutput('暗号化が必要なメールアドレスはありません。')
            ->assertSuccessful();
    }
}
