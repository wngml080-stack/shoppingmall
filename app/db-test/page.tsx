/**
 * @file db-test/page.tsx
 * @description Supabase 데이터베이스 테이블 데이터 조회 테스트 페이지
 *
 * 이 페이지는 Supabase 데이터베이스의 테이블 데이터를 조회하여 표시합니다.
 * Service Role 클라이언트를 사용하여 RLS를 우회하고 모든 데이터에 접근합니다.
 */

import { getServiceRoleClient } from "@/lib/supabase/service-role";

export default async function DbTestPage() {
  const supabase = getServiceRoleClient();

  // users 테이블의 모든 데이터 가져오기
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">데이터베이스 조회 오류</h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 font-semibold">
              오류가 발생했습니다:
            </p>
            <pre className="mt-2 text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">데이터베이스 테이블 조회</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Supabase users 테이블의 데이터를 표시합니다.
        </p>

        {/* users 테이블 데이터 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Users 테이블</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            총 {users?.length || 0}개의 레코드
          </p>

          {users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Clerk ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">이름</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      생성일시
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-4">
                        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {user.id}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {user.clerk_id}
                        </code>
                      </td>
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.created_at).toLocaleString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>현재 저장된 사용자 데이터가 없습니다.</p>
              <p className="text-sm mt-2">
                `/auth-test` 페이지에서 로그인하면 users 테이블에 데이터가
                추가됩니다.
              </p>
            </div>
          )}
        </div>

        {/* Raw JSON 데이터 표시 (디버깅용) */}
        <details className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <summary className="cursor-pointer font-semibold mb-4">
            Raw JSON 데이터 보기 (클릭하여 펼치기)
          </summary>
          <pre className="text-xs bg-white dark:bg-gray-800 p-4 rounded border overflow-auto max-h-96">
            {JSON.stringify(users, null, 2)}
          </pre>
        </details>
      </div>
    </main>
  );
}

