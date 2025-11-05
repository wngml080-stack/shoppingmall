/**
 * @file app/checkout/checkout-form.tsx
 * @description 주문 폼 컴포넌트
 *
 * 배송지 정보를 입력하고 주문을 생성하는 Client Component입니다.
 *
 * 주요 기능:
 * 1. 배송지 정보 입력 (이름, 연락처, 주소, 주문 요청사항)
 * 2. 주문 상품 목록 표시
 * 3. 총 주문 금액 표시
 * 4. react-hook-form + Zod 유효성 검사
 * 5. 주문 생성 및 로딩 상태 처리
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createOrder } from "@/actions/orders";
import { calculateCartSummary } from "@/lib/cart-utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CartItemWithProduct } from "@/types/cart";
import type { CreateOrderData } from "@/types/order";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CheckoutFormProps {
  cartItems: CartItemWithProduct[];
  clerkId: string;
}

/**
 * 배송지 정보 스키마 (Zod)
 */
const shippingAddressSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().regex(/^01[0-9]-\d{3,4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)"),
  postcode: z.string().min(1, "우편번호를 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  detailAddress: z.string().optional(),
  orderNote: z.string().max(500, "요청사항은 500자 이내로 입력해주세요").optional(),
});

type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;

export function CheckoutForm({ cartItems, clerkId }: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 총액 계산
  const summary = calculateCartSummary(cartItems);
  const formattedTotal = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(summary.totalAmount);

  // 폼 설정
  const form = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      name: "",
      phone: "",
      postcode: "",
      address: "",
      detailAddress: "",
      orderNote: "",
    },
  });

  // 주문 생성
  const onSubmit = async (data: ShippingAddressFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.group("주문 폼 제출");
      console.log("배송지 정보:", data);

      const orderData: CreateOrderData = {
        shippingAddress: {
          name: data.name,
          phone: data.phone,
          postcode: data.postcode,
          address: data.address,
          detailAddress: data.detailAddress || undefined,
        },
        orderNote: data.orderNote || undefined,
      };

      const result = await createOrder(clerkId, orderData);

      console.log("주문 생성 결과:", result);
      console.groupEnd();

      if (result.success && result.orderId) {
        // 주문 성공 시 주문 완료 페이지로 리다이렉트 (나중에 구현)
        router.push(`/checkout/success?orderId=${result.orderId}`);
      } else {
        setError(result.error || "주문 생성에 실패했습니다.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("주문 생성 오류:", err);
      setError(err instanceof Error ? err.message : "주문 생성 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 주문 폼 (왼쪽, 2열) */}
      <div className="lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 배송지 정보 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                배송지 정보
              </h2>

              <div className="space-y-4">
                {/* 이름 */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름 *</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 연락처 */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>연락처 *</FormLabel>
                      <FormControl>
                        <Input placeholder="010-1234-5678" {...field} />
                      </FormControl>
                      <FormDescription>하이픈(-)을 포함하여 입력해주세요.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 우편번호 */}
                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>우편번호 *</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 주소 */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주소 *</FormLabel>
                      <FormControl>
                        <Input placeholder="서울시 강남구 테헤란로 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 상세주소 */}
                <FormField
                  control={form.control}
                  name="detailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상세주소</FormLabel>
                      <FormControl>
                        <Input placeholder="123동 456호 (선택사항)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 주문 요청사항 */}
                <FormField
                  control={form.control}
                  name="orderNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주문 요청사항</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="배송 시 요청사항을 입력해주세요. (선택사항)"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>최대 500자까지 입력 가능합니다.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* 주문하기 버튼 */}
            <div className="flex gap-3">
              <Link href="/cart" className="flex-1">
                <Button type="button" variant="outline" className="w-full" disabled={isSubmitting}>
                  뒤로가기
                </Button>
              </Link>
              <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    주문 처리 중...
                  </>
                ) : (
                  "주문하기"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* 주문 요약 (오른쪽, 1열) */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            주문 요약
          </h2>

          {/* 주문 상품 목록 */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              const formattedItemTotal = new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
              }).format(itemTotal);

              return (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  {/* 상품 이미지 */}
                  <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.category ? (
                      <Image
                        src={`https://placehold.co/400x400/3b82f6/ffffff?text=${encodeURIComponent(item.product.category)}`}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                          {item.product.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {item.product.price.toLocaleString("ko-KR")}원 × {item.quantity}개
                    </p>
                    {item.color && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        색상: {item.color}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-2">
                      {formattedItemTotal}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 총액 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">총 상품 수</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {summary.totalItems}개
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">총 주문 금액</span>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formattedTotal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

