import { NextResponse } from "next/server";
import type { Locale } from "@/lib/i18n";
import { getResearchSignalCopy, researchSignals } from "@/lib/mockData";
import { getResearchCommand, type ResearchCommandId } from "@/lib/researchCommands";

export const dynamic = "force-dynamic";

type NansenSignalResponse = {
  source: "nansen" | "price" | "mock";
  commandId: ResearchCommandId;
  title: string;
  clue: string;
  finding: string;
  nextAction: string;
  topicId: string;
  xp: number;
  debug?: {
    hasApiKey: boolean;
    endpoint: string;
    fallbackReason?: string;
    status?: number;
  };
};

const nansenEndpoint = process.env.NANSEN_SMART_MONEY_ENDPOINT || "https://api.nansen.ai/api/v1/smart-money/netflow";
const nansenHoldingsEndpoint = process.env.NANSEN_SMART_MONEY_HOLDINGS_ENDPOINT || "https://api.nansen.ai/api/v1/smart-money/holdings";

const getMockSignal = (
  locale: Locale,
  level: number,
  commandId: ResearchCommandId,
  debug?: NansenSignalResponse["debug"],
): NansenSignalResponse => {
  const command = getResearchCommand(commandId);
  const matchedSignal = researchSignals.find((signal) => signal.topicId === command.topicId);
  const fallbackSignal = researchSignals[Math.max(0, level - 1) % researchSignals.length];
  const signal = matchedSignal ?? fallbackSignal;
  const copy = getResearchSignalCopy(signal, locale);
  const commandCopy = command[locale];
  const mockReports: Record<ResearchCommandId, { title: string; clue: string; finding: string; nextAction: string }> = {
    "mnt-price": {
      title: commandCopy.label,
      clue:
        locale === "en"
          ? "Market lens: start with $MNT price, then confirm with Mantle activity."
          : "Market視点：まず$MNT価格を見て、次にMantle上の活動量で裏取りします。",
      finding:
        locale === "en"
          ? "Useful check: if price rises while ecosystem activity also rises, momentum is healthier. If price rises alone, it may be short-term heat."
          : "見るポイント：価格上昇とエコシステム活動の増加が一緒なら健全な勢い。価格だけ上がるなら短期の過熱かもしれません。",
      nextAction:
        locale === "en"
          ? "Run Mantle Health next to see whether network activity supports the price move."
          : "次はMantle Healthを実行すると、価格の動きをネットワーク活動が支えているか確認できます。",
    },
    "mantle-health": {
      title: commandCopy.label,
      clue:
        locale === "en"
          ? "Network lens: check liquidity, transaction activity, and whether apps are attracting repeat users."
          : "Network視点：流動性、取引活動、アプリに継続ユーザーがいるかを見ます。",
      finding:
        locale === "en"
          ? "Mantle looks healthier when TVL, active wallets, and app usage improve together. I would watch DEX/liquid staking activity before calling the network strong."
          : "MantleはTVL、アクティブウォレット、アプリ利用が一緒に伸びる時に健康度が高いです。強いと判断する前にDEXとLiquid Staking周辺を見ます。",
      nextAction:
        locale === "en"
          ? "Run Whale Activity next to check whether large wallets support or fade this network signal."
          : "次はWhale Activityを実行すると、大口ウォレットがこの流れを支持しているか確認できます。",
    },
    "ecosystem-discovery": {
      title: commandCopy.label,
      clue:
        locale === "en"
          ? "Discovery lens: look for apps where users have a reason to come back, not just one-time farming."
          : "Discovery視点：一回きりのファーミングではなく、ユーザーが戻ってくる理由のあるアプリを探します。",
      finding:
        locale === "en"
          ? "Watchlist: Merchant Moe for DEX liquidity, INIT Capital for money-market loops, and Agni Finance for trading depth. Next check: which one is gaining repeat volume."
          : "注目候補：DEX流動性ならMerchant Moe、レンディング/ループならINIT Capital、取引深度ならAgni Finance。次は、どれが継続的な出来高を増やしているかを見ます。",
      nextAction:
        locale === "en"
          ? "Run RWA Report next if you want to compare this discovery with a more specialized Mantle theme."
          : "次はRWA Reportを実行すると、この発見をより専門的なMantleテーマと比べられます。",
    },
    "rwa-report": {
      title: commandCopy.label,
      clue:
        locale === "en"
          ? "RWA lens: separate real demand from token narrative."
          : "RWA視点：本物の需要と、ただのナラティブを分けて見ます。",
      finding:
        locale === "en"
          ? "Useful RWA checklist: issuer credibility, redemption/liquidity path, yield source, and whether users can actually use the asset in Mantle DeFi."
          : "RWAチェックリスト：発行体の信頼性、償還/流動性の道筋、利回りの源泉、Mantle DeFi内で実際に使えるか。この4つを見ます。",
      nextAction:
        locale === "en"
          ? "Run Ecosystem Discovery next to see whether RWA connects to actual Mantle apps."
          : "次はEcosystem Discoveryを実行すると、RWAが実際のMantleアプリとつながるか見られます。",
    },
    "whale-activity": {
      title: commandCopy.label,
      clue:
        locale === "en"
          ? "Whale lens: large-wallet moves are clues, not instructions."
          : "Whale視点：大口ウォレットの動きは指示ではなく、手がかりです。",
      finding:
        locale === "en"
          ? "Bullish clue: whales accumulate while liquidity improves. Risk clue: whales move to exchanges while price is extended. I would compare both before reacting."
          : "強気の手がかり：流動性が増えながら大口が蓄積。リスクの手がかり：価格上昇後に大口が取引所へ移動。両方を比べてから判断します。",
      nextAction:
        locale === "en"
          ? "Run Daily Alpha next to combine this whale clue with price, network, and ecosystem context."
          : "次はDaily Alphaを実行すると、この大口シグナルを価格・ネットワーク・エコシステムとまとめて見られます。",
    },
    "daily-alpha": {
      title: commandCopy.label,
      clue:
        locale === "en"
          ? "Daily lens: combine price, network health, ecosystem discovery, and whale behavior into one watchlist."
          : "Daily視点：価格、ネットワーク健康度、注目プロジェクト、大口行動を1つのウォッチリストにまとめます。",
      finding:
        locale === "en"
          ? "Today's plan: 1) check $MNT direction, 2) compare Merchant Moe / INIT / Agni activity, 3) confirm whether large wallets support or fade the move."
          : "今日の見る順番：1) $MNTの方向感、2) Merchant Moe / INIT / Agni の活動比較、3) 大口ウォレットが流れを支持しているか。これは予測ではなくウォッチリストです。",
      nextAction:
        locale === "en"
          ? "Run MNT Price next to restart tomorrow's loop from the market temperature."
          : "次はMNT Priceを実行すると、明日のチェックを市場の温度感から始められます。",
    },
  };
  const report = mockReports[command.id] ?? copy;

  return {
    source: "mock",
    commandId: command.id,
    title: report.title,
    clue: report.clue,
    finding: report.finding,
    nextAction: report.nextAction,
    topicId: signal.topicId,
    xp: command.xp,
    debug,
  };
};

const asNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : null);

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1 ? 3 : 5,
  }).format(value);

const formatUsdCompact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);

const getNansenRowValue = (row: Record<string, unknown>) =>
  asNumber(row.net_flow_usd) ??
  asNumber(row.netflow_usd) ??
  asNumber(row.net_flow_24h_usd) ??
  asNumber(row.net_flow_7d_usd) ??
  asNumber(row.amount_usd);

const extractPriceFinding = async (locale: Locale, commandId: ResearchCommandId) => {
  const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=mantle&vs_currencies=usd&include_24hr_change=true", {
    cache: "no-store",
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as { mantle?: { usd?: number; usd_24h_change?: number } };
  const price = asNumber(payload.mantle?.usd);
  const change = asNumber(payload.mantle?.usd_24h_change);
  if (price === null) return null;

  const command = getResearchCommand(commandId);
  const direction = change === null ? null : change >= 0 ? "up" : "down";
  const changeText = change === null ? "" : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

  if (locale === "en") {
    return {
      source: "price" as const,
      commandId,
      title: "$MNT Price Check",
      clue:
        change === null
          ? `$MNT is currently around ${formatUsd(price)}.\n- Data point: live market price\n- Missing context: network usage and wallet behavior`
          : `$MNT is around ${formatUsd(price)} with a 24h move of ${changeText}.\n- Data point: live market price\n- First read: ${direction === "up" ? "short-term momentum is positive" : "short-term pressure is negative"}\n- Missing context: whether Mantle activity confirms the move`,
      finding:
        direction === null
          ? "Price is only a starting point. I should not call this alpha until on-chain activity, liquidity, and wallet behavior point in the same direction."
          : direction === "up"
            ? "The move is constructive only if Mantle app activity is also improving. If price rises while activity is flat, I treat it as heat, not confirmation."
            : "The move is weak on the surface. The useful question is whether this is simple selling pressure or a setup where wallets start accumulating into weakness.",
      nextAction: "Run Mantle Health next to see whether the market move has on-chain support.",
      topicId: command.topicId,
      xp: command.xp,
    } satisfies NansenSignalResponse;
  }

  return {
    source: "price" as const,
    commandId,
    title: "$MNT価格チェック",
    clue:
      change === null
        ? `$MNTは現在 ${formatUsd(price)} 前後です。\n- 見たデータ：ライブ市場価格\n- まだ足りない情報：ネットワーク利用とウォレット行動`
        : `$MNTは現在 ${formatUsd(price)} 前後、24h変化は ${changeText} です。\n- 見たデータ：ライブ市場価格\n- 第一印象：${direction === "up" ? "短期モメンタムは上向き" : "短期では売り圧が強い"}\n- まだ足りない情報：Mantle上の活動がこの動きを裏づけているか`,
    finding:
      direction === null
        ? "価格は入口です。オンチェーン活動、流動性、ウォレット行動が同じ方向を向くまではAlpha扱いしません。"
        : direction === "up"
          ? "価格上昇は、Mantleアプリの利用も増えている時だけ強いシグナルです。価格だけ上がって活動が増えないなら、確認ではなく過熱として見ます。"
          : "表面上は弱い動きです。単なる売り圧なのか、それとも弱さの中でウォレットが拾い始める前兆なのかを分けて見ます。",
    nextAction: "次はMantle Healthを実行すると、価格の動きにオンチェーンの裏づけがあるか見られます。",
    topicId: command.topicId,
    xp: command.xp,
  } satisfies NansenSignalResponse;
};

const extractNansenFinding = (
  payload: unknown,
  locale: Locale,
  commandId: ResearchCommandId,
): Pick<NansenSignalResponse, "title" | "clue" | "finding" | "nextAction" | "topicId" | "xp" | "commandId"> | null => {
  const command = getResearchCommand(commandId);
  const root = payload as { data?: unknown; result?: unknown; rows?: unknown };
  const rows = Array.isArray(root?.data)
    ? root.data
    : Array.isArray(root?.result)
      ? root.result
      : Array.isArray(root?.rows)
        ? root.rows
        : Array.isArray(payload)
          ? payload
          : [];
  const typedRows = rows.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object" && !Array.isArray(row));
  const first =
    typedRows.find((row) => {
      const value = getNansenRowValue(row);
      return value !== null && Math.abs(value) >= 1;
    }) ?? typedRows[0];
  if (!first) return null;

  const label = String(first.token_symbol || first.symbol || first.name || first.token_name || first.wallet_label || "Mantle activity");
  const rawNetflow = getNansenRowValue(first);
  const netflow = rawNetflow !== null && Math.abs(rawNetflow) >= 1 ? rawNetflow : null;
  const hasZeroOrTinyValue = rawNetflow !== null && Math.abs(rawNetflow) < 1;
  const direction = netflow === null ? null : netflow >= 0 ? "inflow" : "outflow";
  const netflowText = netflow === null ? (hasZeroOrTinyValue ? "0 or too small to treat as a signal" : "unknown size") : formatUsdCompact(Math.abs(netflow));
  const titleByCommand =
    commandId === "mantle-health"
      ? locale === "en"
        ? "Mantle Network Health"
        : "Mantle Network Health"
      : commandId === "ecosystem-discovery"
        ? locale === "en"
          ? "Mantle Ecosystem Discovery"
          : "Ecosystem Discovery"
        : commandId === "rwa-report"
          ? locale === "en"
            ? "Mantle RWA Intelligence"
            : "RWA Intelligence"
          : commandId === "whale-activity"
            ? locale === "en"
              ? "Whale Signals"
              : "Whale Signals"
            : commandId === "daily-alpha"
              ? locale === "en"
                ? "Daily Alpha Report"
                : "Daily Alpha Report"
              : locale === "en"
                ? "Mantle Market Analysis"
                : "MNT Market";

  if (locale === "en") {
    const observed =
      direction === null
        ? `Nansen returned one Mantle-related row around ${label}.\n- Flow size: ${netflowText}\n- Signal type: wallet / token activity clue\n- Confidence: low; I should not treat this as real inflow yet`
        : `Nansen returned a ${direction} clue around ${label}.\n- Approx. flow size: ${netflowText}\n- Direction: ${direction === "inflow" ? "money appears to be entering" : "money appears to be leaving"}\n- Signal type: wallet / token activity clue\n- Confidence: medium only if another Mantle category confirms it`;
    const finding =
      direction === null
        ? `${label} appeared in the Nansen response, but the value is not actionable.\n- What it may mean: the API can see this token/activity, but the flow is too small or missing\n- Strong version: a later run shows non-zero flow plus repeat wallet activity\n- Weak version: the same zero-size row keeps appearing\n- My read: I will record it as a weak watchlist clue, not as alpha`
        : commandId === "daily-alpha"
        ? `${label} is today's watch item, but I need confirmation.\n- What it may mean: smart wallets or tracked activity are paying attention to this area\n- Bull case: price, network activity, and whale behavior all improve together\n- Bear case: this is an isolated flow with no follow-through\n- My read: keep it on the watchlist, then compare it with MNT Price before calling it alpha`
        : commandId === "rwa-report"
          ? `${label} is useful only if it connects to real demand.\n- What it may mean: capital is touching an asset or theme that could be framed as RWA-related\n- Strong version: credible issuer, clear redemption path, visible liquidity, and actual Mantle DeFi usage\n- Weak version: only narrative attention with no utility or exit path\n- My read: narrative alone is weak; utility plus liquidity is stronger`
          : commandId === "ecosystem-discovery"
            ? `${label} is worth watching only if activity repeats.\n- What it may mean: users or wallets are touching a theme inside the Mantle ecosystem\n- Strong version: repeated wallets, steady volume, and a reason for users to return\n- Weak version: one transaction spike caused by farming or incentives\n- My read: compare this with Merchant Moe, INIT Capital, and Agni-style activity before ranking it`
            : commandId === "mantle-health"
              ? `${label} helps with the network-health question.\n- What it may mean: capital movement is appearing somewhere in the Mantle activity map\n- Healthy signal: flow improves together with app usage, liquidity, and repeat wallets\n- Weak signal: flow appears but users do not return or liquidity stays thin\n- My read: this is a clue to verify with Whale Activity, not a final answer`
              : `${label} is a wallet-derived clue.\n- What it may mean: tracked wallets are creating movement around this area\n- Bullish version: large wallets accumulate while liquidity improves\n- Risk version: large wallets rotate out after price runs or before liquidity dries up\n- My read: useful, but only after checking whether the move continues across more wallets`;
    const nextAction =
      commandId === "mnt-price"
        ? "Next: run Mantle Health to see whether price movement has on-chain support."
        : commandId === "mantle-health"
          ? "Next: run Whale Activity to check whether large wallets support this network signal."
          : commandId === "ecosystem-discovery"
            ? "Next: run RWA Report to compare this ecosystem clue with a more specific Mantle theme."
            : commandId === "rwa-report"
              ? "Next: run Ecosystem Discovery to see whether this RWA clue connects to real Mantle apps."
              : commandId === "whale-activity"
                ? "Next: run Daily Alpha to combine this wallet clue with market and network context."
                : "Next: run MNT Price to restart the loop from current market temperature.";
    return {
      commandId,
      title: titleByCommand,
      clue: observed,
      finding,
      nextAction,
      topicId: command.topicId,
      xp: command.xp,
    };
  }

  const nextAction =
    commandId === "mnt-price"
      ? "次：Mantle Healthを実行すると、価格の動きにオンチェーンの裏づけがあるか見られます。"
      : commandId === "mantle-health"
        ? "次：Whale Activityを実行すると、大口ウォレットがこのネットワークシグナルを支持しているか確認できます。"
        : commandId === "ecosystem-discovery"
          ? "次：RWA Reportを実行すると、このエコシステムの手がかりをより専門的なMantleテーマと比べられます。"
          : commandId === "rwa-report"
            ? "次：Ecosystem Discoveryを実行すると、このRWAの手がかりが実際のMantleアプリとつながるか見られます。"
            : commandId === "whale-activity"
              ? "次：Daily Alphaを実行すると、このウォレットの手がかりを価格・ネットワークとまとめて読めます。"
              : "次：MNT Priceを実行すると、現在の市場温度からもう一度チェックできます。";

  return {
    commandId,
    title: titleByCommand,
    clue:
      direction === null
        ? `Nansenから ${label} に関するMantle関連の行が返りました。\n- フロー規模：${hasZeroOrTinyValue ? "0、またはシグナルとして扱うには小さすぎます" : "このレスポンスでは取得できませんでした"}\n- シグナル種別：ウォレット / トークン活動の手がかり\n- 信頼度：低め。まだ本物の流入として扱いません`
        : `Nansenから ${label} 周辺の${direction === "inflow" ? "流入" : "流出"}ヒントが返りました。\n- おおよその規模：${netflowText}\n- 方向：${direction === "inflow" ? "資金が入っている可能性" : "資金が抜けている可能性"}\n- シグナル種別：ウォレット / トークン活動の手がかり\n- 信頼度：別のMantleカテゴリでも確認できたら中くらい`,
    finding:
      direction === null
        ? `${label} はNansenの返答に出ていますが、今の値だけでは分析対象として弱いです。\n- 何を示すか：API上ではこのトークン/活動が見えているが、資金移動としては小さい、または金額が欠けている可能性\n- 強いケース：次回以降に0ではないフローと継続ウォレット行動が出る\n- 弱いケース：同じ0規模の行だけが何度も出る\n- 私の読み：Alphaではなく、弱いウォッチリスト候補として記録します`
        : commandId === "daily-alpha"
        ? `${label} は今日のウォッチ項目です。ただし確認が必要です。\n- 何を示すか：スマートウォレットや追跡対象の活動が、この周辺に注意を向けている可能性\n- 強いケース：価格、ネットワーク活動、大口行動が同じ方向に改善\n- 弱いケース：このフローだけで後続がない\n- 私の読み：予測ではなく、今日見るべき候補として扱い、次にMNT価格で温度感を確認します`
        : commandId === "rwa-report"
          ? `${label} は、実需と結びつく時だけRWAの手がかりになります。\n- 何を示すか：RWAっぽいテーマ、または資産性のある領域に資金の動きがある可能性\n- 強いケース：発行体の信頼性、償還/流動性の道筋、Mantle DeFi内での利用がそろう\n- 弱いケース：話題性だけで、実用性や出口流動性が見えない\n- 私の読み：ナラティブだけなら弱く、実用性と流動性がある時に強いです`
          : commandId === "ecosystem-discovery"
            ? `${label} は、継続利用が見えるなら注目候補です。\n- 何を示すか：Mantleエコシステム内のどこかで、ユーザーまたはウォレットの接触がある可能性\n- 強いケース：同じウォレットの再利用、安定した出来高、ユーザーが戻る理由がある\n- 弱いケース：単発の出来高やインセンティブ目的のファーミング\n- 私の読み：Merchant Moe、INIT Capital、Agni系の活動と比べて順位づけします`
            : commandId === "mantle-health"
              ? `${label} はMantleの健康度を見る材料になります。\n- 何を示すか：Mantle上の活動マップのどこかで資金移動が出ている可能性\n- 強いシグナル：フロー、アプリ利用、流動性、継続ウォレットが一緒に改善\n- 弱いシグナル：フローはあるがユーザーが戻らない、または流動性が薄い\n- 私の読み：結論ではなく、Whale Activityで裏取りするための手がかりです`
              : `${label} はウォレット由来の手がかりです。\n- 何を示すか：追跡対象ウォレットがこの周辺で動いている可能性\n- 強気パターン：流動性改善と同時に大口が蓄積\n- リスクパターン：価格上昇後に大口が移動、または流動性が薄くなる前に離脱\n- 私の読み：もっと多くのウォレットで動きが続くかを見てから判断します`,
    nextAction,
    topicId: command.topicId,
    xp: command.xp,
  };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") === "ja" ? "ja" : "en";
  const level = Number(url.searchParams.get("level") || 1);
  const command = getResearchCommand(url.searchParams.get("command"));
  const debugEnabled = url.searchParams.get("debug") === "1";
  const apiKey = process.env.NANSEN_API_KEY;
  const endpoint = command.id === "ecosystem-discovery" || command.id === "rwa-report" ? nansenHoldingsEndpoint : nansenEndpoint;
  const baseDebug = debugEnabled
    ? {
        hasApiKey: Boolean(apiKey),
        endpoint: command.id === "mnt-price" ? "CoinGecko simple price" : endpoint,
      }
    : undefined;
  const fallback = (fallbackReason: string, status?: number) =>
    getMockSignal(locale, Number.isFinite(level) ? level : 1, command.id, debugEnabled ? { ...baseDebug!, fallbackReason, status } : undefined);

  if (command.id === "mnt-price") {
    try {
      const priceFinding = await extractPriceFinding(locale, command.id);
      if (priceFinding) return NextResponse.json({ ...priceFinding, debug: debugEnabled ? { ...baseDebug!, status: 200 } : undefined });
      return NextResponse.json(fallback("Price API returned no usable MNT price."));
    } catch {
      return NextResponse.json(fallback("Price API request failed before a response was received."));
    }
  }

  if (!apiKey) return NextResponse.json(fallback("NANSEN_API_KEY is not loaded by the running server."));

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        chains: ["mantle"],
        pagination: { page: 1, per_page: 20 },
        order_by: [{ field: command.id === "ecosystem-discovery" || command.id === "rwa-report" ? "amount_usd" : "net_flow_24h_usd", direction: "DESC" }],
      }),
      cache: "no-store",
    });

    if (!response.ok) return NextResponse.json(fallback(`Nansen API returned ${response.status}.`, response.status));

    const payload = await response.json();
    const finding = extractNansenFinding(payload, locale, command.id);
    if (!finding) return NextResponse.json(fallback("Nansen API returned no usable rows.", response.status));

    return NextResponse.json({
      source: "nansen",
      ...finding,
      debug: debugEnabled ? { ...baseDebug!, status: response.status } : undefined,
    } satisfies NansenSignalResponse);
  } catch {
    return NextResponse.json(fallback("Nansen API request failed before a response was received."));
  }
}
