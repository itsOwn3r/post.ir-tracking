import db from "@/lib/db";
import { NextResponse } from "next/server";
import fetch from "node-fetch";

export const revalidate = 0;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const code = searchParams.get("code");

    let findTrackingCode;

    try {

        if (code) {
            findTrackingCode = await db.trackingPackage.findFirst({
                where: {
                    code: code,
                    isActive: true
                },
                include: {
                    TrackingLog: {
                        orderBy: {
                            time: "desc"
                        }
                    }
                }
            })    
        } else {
        findTrackingCode = await db.trackingPackage.findFirst({
            where: {
                isActive: true
            },
            include: {
                TrackingLog: {
                    orderBy: {
                        time: "desc"
                    }
                }
            }
        })        
        }


        if (!findTrackingCode) {
            return NextResponse.json({ success: false, message: "This tracking code is not active at the moment!" });
        }
        

        // use IR ip
    const sendRequest = await fetch(`https://tracking.post.ir/search.aspx?id=${findTrackingCode.code}`,
        {
        headers: {
            accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,fa;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            pragma: "no-cache",
            "sec-ch-ua":
            '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            cookie:
            "ASP.NET_SessionId=szrxsqiqmx5i4djk5nv0u41h; BIGipServerPool_Farm_126=2120548618.20480.0000",
            Referer:
            `https://tracking.post.ir/search.aspx?id=${findTrackingCode.code}`,
            "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `__EVENTTARGET=btnSearch&__EVENTARGUMENT=&__VIEWSTATE=qvK6Pw2ag6QzXVlnpPhSa7npo6EuyOnH20YRkMpI6rbCGdLzf9Moj0SnLWF2mNJzmPj98kucWfvJ2q1ury9pR0x0X0gz%2F%2BsyjaBsizkXYRhzSWP1Og2HRtwPi4WvDPrruIOWuDjfvM0xEVk%2F0DPQ%2BScW%2FyBfPLHVGsHx18JfYK%2BF%2FwfdxBQqM7IguVjUv9yzWCV2i8oYwWMQdzp2BExbjNZ8SaGKm%2FHa6YuOvPTEWdbkQdsE4%2BMZp%2ByzqGB%2B6wHvPraLYUztYhc7Ag9L4guGDOWCrGreF5eBCvmlz%2BX52Hm3MBoJ1Ph0jpgd4Qehbh7vOROQPGetPASZ%2BAX2CIsS6JEFks8%2FQ9l6p44O9w617ymE%2B1namwmMnajhNTSeQYcnsKIvk0oYGSYCS3UvFuMfO1RdO71j8Y4k6DwW3vuTBuQoIdvZaoQijGPz7viCpHTAz56UHfUk788xw0dAmtO3OGuj6NOGxQZiWqU2oisQoZov1HhTnRBQH0UBk9rBwXQ4yIlik1trkc6zF0MDfahOjrF4ncnecxgeHK0HPWqEUs5RJErohLdV%2B5xEFLpLapV5tGqwkAorKd%2BaQ9i8DXMFl8RK9a%2F5Er6YwCPEjcdfzyPJXjB5HZFnpPvDc7dPemqx7eHzaoAfDRuD4g0SyNzfktllMfgE%2Fm9ls%2Ffw1EB0%2FCQFCq2Vr19H86BRNuozrodlFolbXk6IkLHAIf517WR1hg3Cwi4Wg2gjTWuEZFFI26BiuXNxRGWv6ACYO99U9RxolA6J7XXfkwbCld8lBOEnFihvg%2F%2BORlE2G2CHsWu5Kc8b%2F%2BSMOPZwVZEnRcrh3ze%2BGQecGwjMPLDQlX1cZW2R9XZQW9I1fqYqj3cLQV7eqI8XUfByH9V3GdQ8rLnJJhw52RVgIhuB%2F7cQIVMncNlWpCRdXg5agUvFW%2FO%2BlQdEafMknvRhpOFwGZOUaV7L3KHR5f2te2ZBRpdOBAZl8g4%2F2ShqrMarLFHabe86UDtP9ppRCsK3b%2FrEvZn0IYu7iGeUjDQ%2BmEhXMlXIHZ6VmNYQ0CpRV49DL4FaKirdFY3e5lkrBOcEWjKCH5cWDoowcr6QurSGG0%2FtHLrmNvq9s5qt3n%2BM9eDEQvbqfUXGp%2BqKYwpnL7y5fYbaciYzN5Yed82OsUxXckxDNn2z0dplwRV0V4fAtNKRngCm2jcEns0JabTfsS%2F7%2BfIKhIm3Wt%2F2aa0wmSKlIX%2F3j%2B%2FK5xRp9SoMG1FfKyULdGXFFgLCKAeAGUNwAUHFl88d4cBjS61QMRaTy%2FTpLe%2FlNwvwR9FwqAuH56XWH7%2FXEMzTRahnSDI0j6%2FvrenabJFpLusnq%2B3%2FlnAgnt%2BwQFQhKS34%2Bqscs0pw6CWoR9HUCh%2B1d37P2c22jWhNOFHrSzA88tpPfUbIg0snbq5FoX9FdMOqCNM4HhqeBOxR633ALWBABFfc0t%2FOyNRIK1lq6O2Q%2Fgk3QEcwacU8JqpRkj0roSAmzQ4AMBk7q8cs9rW3%2BAtiM%2FOKEFSUBWbTFHUcDzIO4N5oHgcKZcFBV%2Fb2WXC0sgBLvnQpcBZmg9ji%2FLpr4LtrsKt6nW9PGzhwuarQtcHy7bWcv%2FbQa8LwYSUQbehPrnvzx58OPAZXrCBMpTcsq3rmg9t62a8D1uYx338VLMrHOcF9kQ5WG4cN5EmVxaV9Ijx1LRvsv36AwZpSO7k8p98QB%2FN17MnD8qkow0fahgeVyjLBjbny0sITg2BTGFwyh4rdmHxVpwtSxnmgOq1keheFopl87aCR4K64F5Ekl2wK2bRsv8bOrYW4r8myEtrg9BxsldQQ2eA%2F4jDjwWSv4lD%2FlBe5QG9Kywx7PBMURn7kAFrJRArF4yRLVlaFvHR29cLyd7imvC0O4rvhG%2F4mhwVTNtyoqsmzE3%2FkWkYa1sayiTWxQMheVrskJcKw107UzHzkTb5MytcDqFI6UFcbc4N7pEmYHK0kE5nFTMWkEusheiiRn6h8mN01YswFgCK5AErkN7nAqRF1dPuVyVIDsknT21cCpBuwLZJNV78ES2L3UNEchasG5gbEbCzjfQlDWCroTyb%2FbXPVXkYwPkgiX%2BArOGWKb9%2FNAHYYqGG7Wq%2BJZUcquIH4tHIM1w4P053jQAsnL1oQuAPMJzVMVl0oAmtQmfNPh5y9WS%2FtjewYpbsOQmIz8hMjVS63VcyHGelaW5FLLaRvElK9kEOHcvDTftJMHvJTDIKI67bU0OicTSnx5EyA3ov%2BAeKZXnFRMexKmjxluZf%2B2FhLcIH93TC45k%2FU%2FSBjcTwxpOnFZUuhcdAUt84TpHxZJufMqqOiwJ9S6WfbsmBnD4bwgcctYYN90cJ%2BfJA1jM23AHO1iYZtcdxLpPL28f%2BGjgCkhFzS0KayIbcWc3XmAM11DnSY8jDe6sNiDXtz%2BnqzbGjwYDGyzYASP4ubixrvHz3FKtqm0EJEkFc%2BCdBWPIW5rpxSaXTd5z%2FfLJQV5NRncBVHWRIPsFRfpso9Oa9di6xdIcy9feSuSYlniPexocX4Om88yzb1ydKWal6UMXjmEHsMfjANgNsBEaymr5lrAYsE9TIC2LZbRUyRyRXbHL3MzOBa01dgqcZ524sHChMcJIXqqPz7hhPktQYSKzlS507yIQhnmqfhlUc7lC%2F897XESZzOnppY9qfa8abfgqRh3qKeKG%2BgLhE66m83xL8X7wB%2BEsjiu%2FfC7J0Ypr8Djc6EQg0d0g03Eq2%2BZwKTSsAB7slGpb%2BgLVS2YL4IAsK3%2FQLubFSE%2Bx6%2BiHvni%2FNx9pz%2BwWIZrv1V4Si2WX%2F1SjC14HCLEK7IW%2BXHmF7X23X0Ji6rc40XN2E%2BHhjxa9%2FJT93Newn5LWctqphcwFIZCKnAiIItJZfUKP6pYnZFdLwGzymnJ6scxUH%2BdxbOIYXXmQwePO96gdKfKkGiErwNbr5dzAoz8sZdy2Fd5macPo8Y9DQucaCxgwyc4xk%2FTAuLhByG0iIjEM%2Flwjbi6b8rWsUsmpcZHJmNVfL5z0LDDu0Ot6GA%2FwgLKw3Wox4nTMtexOajIQJtK0nk67%2FNviEcFzpRqQE6NkJwF8r5oqABtnanVbU300rfZPEmoil96aZZfj2iASMW6FxMjUhpO1aBHqFDV0FpxfA1da%2FbwJ0ThyZgLladAJrNVXnO58nRF8qj0FNCKNnvsXdUOHhu7Nj73Xn%2Fs45Ow%2F3wUsG6KDEN6EM%2FavPAuVrAMPREOJbYHXU44lWGUpj04pftCR4oPVj%2BdsmuRQIOUWd%2Bp%2FzxN52z%2BmS8cucfDh4YehgCbtLDT7PJwyrNtL6d17kfyy1%2BxkcUt5JgyWH%2FWoDStnaa7j8AyvPfKO%2FE8KgQ8nIwK9LPRmZkbEhbrOgd2imJgnDBdqSXnSY%2BzTK3BM7r%2BHnkmUHa8MWBANVwoD5r8W661JnExh%2FblVeWcMeb5PWUEklOMBBUpfv43Wo3rTseK%2F5gLksgA%2FU8wJ5JNNXLHaDFutkuk0WGc7MldwXrtP%2BNcqCE9h6s19ms8Us4q0Q8b8J2vZ4ogG38aOuAAY9MDwq7jpJ8D4vvCJ4%2FhWNZjrb3nDvvOnlrnu1Efmn5%2FK9ul5onlDL46r2xY0N%2BnmHsCkhDTrWfdfarqaq5rym%2F0%2BHyjtDtLVqc%2BrDX81e%2Bh%2BcuyAu7i7oOym%2B6XKJoEYUvFfAADqgPO6JWDlryuX1pmXSFEEZ5eGNr7XvMVHAxVxy3zz2eyEC%2Ff9QzicdDkkqwsWyaQ5bLwZrgieG9276mPEu7VfJufe3U%2BRBAJbs73DuVJ3ykradSiubNJ4PzKVogTW5Dd%2FAsEKxrw0fUwuWWhSh%2FExE1hJQFzJya9Rgz2b%2B2qQq%2FoaSRsDd1CfxY1z5ys4%2BrHKBmubBcad5yPfhD1m3udmZNyItQ5xZJFM4up3j2Lw%2FxONsx1p0m9MFItRoq7TWYee%2FgCjWczZADrX8xOtaw9jTBMiywKEr2I%2BDDuK2bWIv7BgBIBeWEfOovMt7zb8tXK7DP2bhaoVlY7lClg9u4xO3l%2FAbdHeezQQ9Tx4COSJTvVfz9isdwtwfkonQ0gwgaCVzmesCceHmT%2F2uEZqjjuy8IzB%2FkAladWfKr%2FIQNIq%2Bn6De2qDqXgPpkSzUbEVYtwUC7VrRB32W18DmxTbZdZoLWSR7bZqm9MdBD3emBpkBzg1McKTlNX9%2BoSbVV5rdLmAjFhbuTFB%2FhI%2FQv2xnTg4jBseq37UrvS6cri%2BQEGtjZKIsUDpQL7D8BQHiJjU87muH3kSbfs3%2FRWBb%2FVttnoTJnKjuQbK8NPCQxQK9X6UuvO8Mc6nD6M63JloCF1X6URKzLYLryUjnIVB9loDKR%2BvmWGARdjcJ0TPzYE7rhrGzjMJiAiG8K%2BWVpmNxxQzbgbafi5WJ4l3JNWV%2F62Ogyzj2o3G3Cc2jtwAlL3GTLvLq73FYcfNHUv01SS6LykKEFpxQ3eVAKroJ0eMy1l3IR1M91Wk35R7B2UoO3fy2LqhmdZ%2Fx7oZAK29jYhzDKPwRp2jqcPPG9XErNnTfBuOd5dc%2BfWD3Y7xbL8sPoqtJe5SNqQCVflrgtsskTF2tfmmpR3y368qC16%2BkAib3UawNJiH134Qcf09fQptmNy%2BU00UHOZGb9%2BHvbYl4foelR6XJGS1AWWEqHQ5cb%2F2%2FUOEsPNi%2F6Qry2oQJzRcS%2Fj23NW%2BQVbjko5WuzINj%2FGdwT1ZsqNRIquiPNc2qyNKzXbcPl3StN2uuX6hD%2BfHCML1K0h2DNrFH3YSA%2BpY4qpwVOJW9yR8blIRCSBt7oqj4WWaZokkXc%2FSDGjBpMdyOVfm6W3J%2FDgeoogJ2NA9DwoBlflaNMQOfPzh%2BN4SAumUwB2x1iPPSiwuW%2Bv8QOEfaSDjjMuT47vZ2FsxE%2BLQVXRevEruMgE7LJBTNGv%2Fi%2BqtZGuxZC52B1HYEKMQw8g7s4fGBaHLqXYboxmaRQoi1VYhvEGIOgJzxJD%2B0myWnKcwesVnAy7yZSQf1xU3fJRpHgKrlcLzmn97hQbHg9LDGfsNhV94sI1qoZTA%2BN%2FBRj5XRII69a594fYVE9sbm20XNxwbHETbOSSyWL2JIleDe%2Fry4ObTdBCqhXyK7BvBUSLlkWNeUxtWT%2Fg%2B%2Fi5bR43M0wjbsvA09dCfq%2BglXt6iBm9AUBoc1KkxLb3HHWjf896XzKHdnOzTmY7anwN3%2BitTvfwixicYddcjVKoSItkx4KOmDjkXY2B5DVJre9rgrKaSt8IfEiS7HkkcOmTAm%2FwDrKntX8ZVrhvq33lrc6wYrpel2x6JHDD0cQIx%2BcCVePv%2BtXRgdJM5VAY%2Bl%2BCqvUjrjEhSPZovBvfxszOLMGnBroUSM8b5hPvA6vUx6GuDEu6dL29DEep88tsZvbhKh5XTLuUT7uctgnez4OE2nyxwqnXxLpyS9FnmTL44lRSnrxscU7Dft%2F4%2Fp0zxdXBZf4P8oFSSIUXdRS5oSiALfWjb7GmRpVNv69pX13Rx9w3PhSC44WJSKJe9Co04jO%2Fc7jhcRV6MHYiSGQx6ruRBF%2FgEocRdk%2BEjo2mN0VBUF6VoYOqt3O0og%2BStHKtOXuVd7XejYh%2F4bsJ1DCI9IIbRib%2BWw3HG4O%2B%2BYw1rdplx2QXrsSk%2BnU%2F7ZTIm%2FbqPjRehlm0NPaKtrtqDV7HLlCfu4hH0tIHjFrwdXfDTIMBsFCf3AdOVA%2BAky6hlqYRKNK8vJYI%2BFu%2BbFdY%2F6G7CnlQlS9ck%2BlrOyzmgF7vkjRalDQ%2F6eiIOvVlFMWvwO0Njx%2BvRwrQwWGmuM169S284qBHE5MLZXefIonZwwoISECEO3HJ1M0IPqD0BM7GfTqK7K7yFt4ovXA9ka3fw9aaODaYD0aE5zTvLKvf%2FBy6uOVgevT9UqKerjdkh3TMxuHotxIO%2BbvQ3U0PLtzgps8XDqsousgIRPLueybAuuZ4q%2BcrVnsaNsR6DD2gtosyoFBxs5s%2BlsYclHuFoM0lxQP9mWqCiU%2B56PA903J%2BGfAj8L5a3%2Fd1mZqikFrMcKK8yHy6wID4kcOCTAORui%2Fn0KAVKfkeaXDo%2FVTuTfQWY7dN9WZCE2L6tjKDzGT7fydx4BiTeGvAzjqMulGZFhdrQcEpENsj6kzsuQyDL%2BtXvtpdraSIsGUfGPci5hDBl0h%2Bj9cNqDmfJoVJHaU%2FoXKuzJqlgn%2B3ngApHXyJ1Rp3DOH%2FC%2FIhSjEEK06KDrjCxrq4HluW9jQMhEng8C4obUfhCigRNKkpXDOr59DZR3pnIOcMijeBoXZl6HNy4hwPX%2BXssKFcjHGiTdLm1vdSXyTpG16hv0g8lmX99YPSlGrYNgX0Nyfz4y%2FfWkXXz0BrHTAK6yJkKYhBPhDx6hPXBA92qFxka%2BFj7WQVmeOCHwRUAcIZ4h38PhTsnrPjhuoqL3FOs6ZRzIInKvUQfrL0ftoZGOQ%2B7NsnvPkg1T%2Fe3PV2ft4QEpM1qupVvssd7Kgot%2Btfc6nYX8kG6sEakAh%2FH5uxJg00aAEnDYMdK95roMSb6c5GRJUS62GanKWM6q9WYXliG2KIPYf32Km%2FeQ1nhikMoU8HKwAM0yKXayQ%2FyX1Rgn4LVqKprNHqwApPB3TDQ6rQtgKScOTzLPxG1ggV1wfc9Mzow6Yol0ufHUhIxctq8%2B3k9gF2ZiJt647tyvzq2PMdowCrdMeL1RYR3L2auiXBi%2FDJ28HMaUA6oSKcTr6f1T3QGVUXkHo6zTgravBIDuIr7A5bAUEft7YJiywXXHfJFqagDNHh10HS4sQEJ2QRXGX69MZKME6eg2KZCI%2F5wL0dZNNssc3Sltu%2Bget0MM%2Bto7fZqOjNNJ5ihoN56hEgThFHWdWeXqw3twvIQY3%2BGCvxkYkoYCG%2FoCAZP8YXjZluBao%2F0BudEnF5kwns%2BF7jz9wNxrBl4SmbvB9hq6%2B4d9mxPdnLd4vqqkgf6kdIUeYegg1EYiTIEA6k7CEbx5j6FLdr0lAP7t2z1hRfEciZc3Hb3khDbMQoRq07vXK6lJyBDJUzINtdTMxV9%2BDd%2BgOQfRGBOK0rYUCicN58a95qRj%2B%2FTVOvua4r1TcvZhqFda0XGQ0Wr7iw4hvfId7rXgvF1LMijlZItuOxcrikMAkoCTeKFQcSBV1guTu4oiNXyfFbACGSMZbH9OpQvzAWHZcKa65JU5XeBzLt9wODUs2hKrSPBgbYhGK80tlH9SHHQNCUAc2joMbFfA7F0%2FKJEQjNmtuOwqVVce7STCR5roDfxBbibM8h6QRlk67yN3CF6CceZVA2sTSfeghpxmWk62%2BCEGBl0PqymBblE78sj%2FeJjk3A1XQrgtu13U5YWkV6n%2F6R2cR9F3cfAEiW1IMpLDvL9itXKnFrsUhNqS9yiXrXR8xMQtqAEXKS7ecWHehI%2FVmFRa2fq%2FE8SNYGd%2FeOX%2BV81W1ek%2FXds8v8VvRMD1u13aZR5JwYn5kK%2BDU96Na85yii5LjNS23ObDYbjcR1afwBNkvmiBMqaGdPwm9RmNMs6u%2B3JOyfVqbileaSCuwvUfu8HPSCF0LjLYt8X8oPAwhnT6a6gfN3sXWM14Vvr6qCA6X%2B1JquNkFNqHLmJbGpjpHU0qMJEqcprwhs6TEC0ZkCPTsSfitjpaFL5p%2BbdP2NwzCq9culBieI348OUbewyFy07a3BJKln2fSyRUJP4U%2BE43Ido8FCdD1IWCc3nAPvVDZmUrW1vcDWtVaXSWypvoDBeDyRH0JYtqMYyJ08WjPTJxohLPOhc7Csch49uevA0q%2BUVPwPigvtg7BIrHzu4bVY%2BeTEuK0lkt5KKQUX%2F4GncokqOBkyOFBxCBFtvsCvOB%2F%2BgUPatWRFuglOqb5fy1zJfiY9lq5v7aknPem9XgsEsgc7mVag84uePSUN6WYq7r%2FwYKwYYSAWZjvPyrvBfl37Tfnjb1MNkq5qETm7fHrYaffUCfZm2oNX6TRucnjs1lPGNRX%2BsrUBcK4cT6eQGo9PO1y2%2B8KeKyaLfUUZLwNExZPtTkA%2B76aLo3SyxTPzibYq6SkZ499VaCKJ46OIZ5uHqVFmUnQ58PziT9c3pqxVrRj%2FgoQoZUf7lY%2FBa9T3Snxl1iO1fTn2Oh6XcLt3Q5YN%2F6o9kr79TjDGhfMsULz3FAF7tzl%2BiZAo29cjAIO9w3SAQqc0vgr5cJM9Fv9wxTkogyji75oN0OIu35rAIotUvm5tsJPYWc4qRh%2F%2Be12viSib6Qqh%2FDyqkE1ckg2etqr6w7oBQnBBsZtedz85v1xyDT0iW4LQ0CMu87n5osI6PclN%2BTLTsnVFRV7I5BvEbSTKNLFz64Lt0VWciyE1bcbzZQe%2BRo9RmEBRZasrmf%2F14wPy7mH%2FacMTxrTYHhVM%2F%2F%2Be4se6ELkqSHP1ZqkxcRk9VmWJDNW%2FVSkcrS6LRk%2FwVYaykwkbjJDPDYAOGa6FROwbUZT2Y6XrANithOj0zkfcYmxXCWo%2F0UuCihizVZU6SQm2dRNm7jABXr4120Mo7ULl%2BwvJt4Gq35cLgBbZ%2FSgBDLZgT4zwgXu1Z8N7IQ3%2Fv5n0dOG%2Fpe15wCjww3fC7hXYVenH3QKAFEcqmxJSZCQXY5vLVqXow3eiYW%2BVRBHyeDm7feE8ywl%2F0yl57Aqpr0Kb7IfYPpWXMKndAbHiB%2FkolIA1DxyDPUvlxsEXE1HpnB%2FCtW1Vlj5SoTnyNFFFqUX36tnhp3kP8Y%2FUZWcaA3wtebCCi2jymDuKFIzr%2FxxBmqqXLciM8sGklw%2FUeHXAvzbhJMStaTUbnR%2FEr2kvXGTT5pm3NGrL8pAhOOQY1%2BHq5QWKG9qqyJn2eBfB8Gjp34%2FXSFgqo1xbOffA04dFTst0lBFMTC8r6Nc3JIEwAKuNkgd1Dd4dCUvuQgOFt2xqUbGzXBlItwn%2BreYRDgfEsnU6frZJRDi2tjm%2Fi7gLBBhX6mC1uZe1i6ZKO8QkaEC6E8mOwELWNDcBIjAJ3%2BV383emRhXNN9Uk1Ie1g2kRuGz4mqBgRte52YfMBmZRYdLhn%2B1Bb3vUi7vZJg1qtg0DspW4UE8EZ3br%2B1jpC4Ik6T007u0D0P5QLyNZKtjcWPOAn2FLR16jvC13z%2BS1N7c8pbms4hMBtTe7XVJv5xv60ji%2F8cJssDTtFFH9c3KeEKsLauHOLWDGy4VXxBOxi03mLtgJp8P7wBDSpbzq5BwwWh75WSeBWorRSjaS30i38jWqC%2Bx1hBEvnDXmvzmba7GHsEtxonxG2KRR7dC%2FdsXmolaSH65AiVPFZo13DhWYZQv8vZbVuieOxsuqX2G5Aoa44Pmpggzhot08dB03qNgFU5bQY7DQOntaoDjZZb3HaBbvl0gtjPAhcHl8%2Bv24Z%2FxYZPt6v3m69GtWVnWgJjIAall%2BhqIx5imoBJDNNzjlSDAibxu8kELQKGCCJZgg1b10Tha477Mt%2Flv5UoJqTHViDARsfrO2YKib%2FF1X5M%2F8c7P9GL7CcDNxHEdoA42GyoGHNde6w1uOFQ3PW2JIlSRkMZkLKgbkTDtnn3KVrhF8DG%2FLtX18YcajMOQ6iyyyizMfsUUUKrZ6ZQr67CngFI6drluYpbgNpdl0q9cklJIm9LON0mVDo5DKvCBP3xAKd7nb1xBTv3U519XOCqqe4CDiFRj40SXWTPAACe1SEMUBhv8IawWuhddYqA3EwNBdTy9v0AFfYHuL7TkaMcMe9x19xylyz2w6XtRMLND2wQ6IV9sUZV%2Fe%2F1OvjPvzWOc2DvzD3PH57mNUvCstt6LjdA3tebqBaoNeObMLCaBzvn0rxfJgQ%2Bc%2BHgXSJLDWCj2lC4hIGZQsVtJUEbMBA0pqieCOnPQ0xV4mT0%2BwwP0XKZJxJraeQCDd%2F72DTlBWLFo%2FV5HkZfl3%2FopJzRKLKD67qm9d6naSFncJXXEoHVr1Xceade%2ForR0qyy1RE0jjRIZTo1mCTviNhKHGNfB4sFkstHhbIy05anFr4VHGP%2FuWeVisrhnL78Rthr5H8ed5Nw5MT6V%2BqP25p5HEHWTMcK8OW0ImHRhk67JcQ4KvtFspx6k94Zt8URgzuszw662wDIbZqKCQDIypeuaTYgV1dx%2Bv7byndCsxKbj3%2B2jZkoGssp35lDQ25mw9UEseVmiYF56rd8eni50WGbZvvGwrt%2Bn1JnIQ6DFtq9flKCLbce68dxUTj6LO6Aw0l9T%2BxdWNNTlDqhurEr%2BgGm59qVCs3D5p9rzHVsJbyHZIpGxeC1rOLlrpYF8ZtbnNpo27exhVThxJisAto4Ucyi9BHTbj7vr3nJqN4VGPq0X2G8YacL%2B4%2BRK2fWHfmod1tvSoBWk1krAkkeS6c3CplgYGfxHLKRdLCkZ1gKhPojaPaLmshSy8BFGVFzvGvv1XBGNV%2FiNu0QLLWMhcBmiZcT98SJ6t4PdTR3wd%2Fxzhh9Qs%2ByoM2CWoM1u4PBcg8wFiH9RW%2FNDnwbdRwbAgHqTsGV8TEMjOiateKVjxaI32AyzT4a6azjBQKf0BmACFT16Nd%2FwI8TOv0Keb9IP3l2ODTpzbAG2p10tjlX0FLgjDYXTKiIonZmvWrqW8LMNPpwizl2sMX79%2FOd92T9xWmbZMnBRvyscwL7Cr8SnABr6y%2Bpckoys8L%2FvX0HVeFJwPVs%2FIvi301%2F4J%2FUcHN%2BCJTLxO7PHt3lzR0209J8NbjHbD%2BpESHJPiPcrX5qfdeOBq5YlOJHZoUOIdv4CHwo%2FOIfRt3oso%2BgFLqgnYnD8oWSSJUcZhV0NJuVXEuHAVgZ8SuNeNeIRaJNUO0viy9UsgwopsoJD%2BfEqbWy9aFX%2Frj4JhTCJCFJxaYo0s6eao9Sh1HLp0ccvoxC7rw3rPN0xSKycuV1w8j%2BIuR%2B%2BIQUNQ6KTQtrXTThcWclH2IGyVIw%2FNYvRE54MGUQ3yEIv6pKgOr3cAmFl3omcDQqFPSzCc0TX7ck%2FW9ofvKGP3bu1lkJta0VB2q9SEd65j5qr8R2%2BMlBE9Kuv67iw4Nd8QfkhjUaE6%2B30cLeo%2FG3mx8AMRvcAsHfhvs6MIUQadpzq9wED%2BwPiX8yvbtbiHiBOZKC%2BlXocI23hBFZLkX9igY96157vNTSy7Jg9O%2FBuAtEZBj%2BTel9bJL%2FiCJ07aQkZCcyluGDVjTege0bkeA5eCOpkJoA%2F48moaV9uzQTES0zXcf7btsvvjKBYr17ttjOKOjshmzr1M%2BEg%2FTrijTAeqB8OvNeOJuaOTMqVuY%2BQCiRw01flkRT1%2B6XeNM8BSEpiubaTDb6mpfxSERTKNTbS2wS5YY%2BaQQRN0GpP2fwI7HK4BpvHhX8lJoBYQkeSKCAeqghKBrhaYpxO9HYw5GYV%2B1973FtOMEDDO55a8gDALmxabk14l5vJX6GBDXJsMFq7dt%2FS%2BjyAc05qkXHtntjUkVoyvIvn5RdKfMSI%2FkAk3EtzQ4HKcFvjTtv4KaY8zxGhjEDLm0QwHclP6x%2BoSUeUI7ur3zxLG6cnxY6O%2FyUjggkPK%2B%2BdqURsf1OKiNPEI4bh7Y2Abv8TywaYItEvCJmR3yhVZ9kfI19g3aMNC9hNp0TU6Rn%2Fy3Nhi%2FUMnSiNfPj0o4s0aHExVVthd4ZbSZyzGy30tMdLgnrREPH7v%2BKxspKrMLRFmH2JTk7PpCR9M%2FFHSol7eL1b82UP%2FXMUkoMxrKgHesS8ciT8fcXo7Mmaf6JKX7gNfQkJ92fzEsTsvmgrX56h2eA7l7FSBTaIdPHk%2BYlbLGxMK3s8F9on9Iemwgi%2FgeVkRzGCBjf%2BwE7pPVMMUzH%2Ba2yflsfU5aIBFVi%2Fo25GPkquL4B4uxDilFjHqr6EeSwGfWvSiJb22OEjCkSDEegRpLg8Zvl%2BfKRfJabHudLtCA3mCyDZpfU%2BJG0mZsiipt02p6xpVanD3A1GsUs19sch47dgYkoJ5mFlFU21aHQTvKi6jsnKUUNL%2FwS5DBsKu%2BEN4eQz3foyyLK3hJoEn4PtBpEg73kGwUk%2FX2wRoztRyw9rA9CH3rMHcT4buGLV0PystYIvbV8f7WPUjuLYxLxEOu409sUXIQG2J1gfRKRiVOyra1c%2BJpt3suFUy%2BVj3cx1yxDH1%2Fyuw2FRf7ulIUZslScxDa7ZtphUV7fJcnahyzwGdPYsHOQyjBs%2Bseo7OjDWMEuAQMFSr9fKTK2aDr2R4EqFv6%2B1uWSd7%2Fmlp3mIKSKK4s3wgBzKw2wza3mqNqQQznRhn9EHrWmuZdkEwRZx20qYNzToxqer5rhoctbS239BxNQlcI6DpV9Y49Dr%2F9ywDgO63TGVf%2B8icU4EVpPef2mpIMIaS4tGleXX6bEKzNelmAVxqjmcqCVTeErdsQqy4MMb1obxfRNPgfHlFogf89txw1jIedz1c1v%2Bxz2QOwacRb4WxRok%2BRAmQeRuFSuanQDc21B2GsQszpO7G0XlSs0xlWvZdrWMvk3WskFlVu4GT%2BW4Q2MM3DezAwmkF6empWvwZw7jEIMpiONfV%2FUPOlxTOv87NutGSIrxB5x1zcSqmvJqaPwBF%2FTl44X2YOKa08NzXyJzA0wk0pr0i4nfnmXoRPHpiajSx12lLeURlN0vjsxczgFUSxIpNLc0bRgmddPCFMlROZgeM8eXOWIUFuL05Bdn9y%2BYvGpGZBQIMG2KdWWTbZCITU1nWbmTmWIphfkA6S2lkIVSid2fA8fvlCV3%2Bu1GR7bYo5K%2FZ4CWeTxfPh%2Beq9%2BaIiRNbNHbnG3ZORNaMweISGNRoMSt8K3Meqp5vMoPtQJGPbQMIFZcphJKgk3JIdbIzbZGviFGsS3ZfyY6XLJ%2Br07DhQPiTngSO%2FYjaBj4svcvtT8iJMi2VaPWT3sN1ZPCiiLK7HNRjSzu0p8yRGfcDefKWQY4lTCs4AovA9V%2FLtIva73FqPak9dGyo7Nq2xCwizMxf50hzKjwij%2FnUenJy51MhzDCyabuv58uBwuq0EtMNCBZlJvxnfigGuVGxePFUNiq5pLkb7RK02F6zJWZzi%2FAYvXuQnaS7kCvo7L8USVmInPlT21Y0GxkVuv5lY2TTnCGV0I1m2gp1Yjbr12bFkukq%2Fxg7oq%2FOfbmakFfkvMy7xUnlMwX8XAw32UvxzOzP8sY2V6DgofM7jtyXlMfur53bGuSQWwiH8FTZe5SYB4lyLQnK2ANXA4LansnNGmrYMhCVsL6dOyi4VRRfNLHSHVMV%2Fzq2gXPt%2FLogoFYxNwkZbqwRnNd%2FJv7J65TzarttGSiyik955K%2B37z73Pq0nlshcYQiZnA88KWtvXrQJy%2BL3dOLO2IANyucOWLj3Rne3xBejLpAz6PDz4Rj223JEXH26dqc6Y%2BdoBajN7FTwkdhY2bLNSrMkDipWuPDvaXIuSPGxktdz3%2FB&__VIEWSTATEGENERATOR=BBBC20B8&__VIEWSTATEENCRYPTED=&__EVENTVALIDATION=Sig0PilV99cn1KGEJMlzRAglz4xivZUp2%2B2kFoCryRkuWGXzz00va6SzpgzWpjZPQ02EE3rZbpdDQQDA1FQv1mNl4lb940xaU1pRrSQAlDsMznq1HOlfeSQ2ND2DQ7q905YilbfWfmlQqlhVozu41mRx33mSKOTvq9W%2FvZ2fV8Ux2t3osBkx7McPhIPwuPsrQ0Sp7hzP75Uy6WGIcy%2F9Ng%3D%3D&txtbSearch=${findTrackingCode.code}&txtVoteReason=&txtVoteTel=`,
        method: "POST",
        }
    );

    const response = await sendRequest.text();

    let sanatizeHtml = response.replaceAll("\n", "");
    sanatizeHtml = response.replaceAll("\r", "");
    sanatizeHtml = response.replaceAll("'", '"');

    const startOfContent = sanatizeHtml.indexOf('<div class="content">');
    const endOfContent = sanatizeHtml.indexOf('<div id="pnlParcel"');

    const slicedStr = sanatizeHtml.slice(startOfContent, endOfContent);

    const regex = /<div class="row newrowdata"><div class="newtddata col-lg-1 col-md-1 col-xs-12 col-sm-1" style="text-align:center">.*?<\/div><div class="newtddata col-lg-5 col-md-5 col-xs-12 col-sm-5">.*?<\/div><div class="newtddata col-lg-5 col-md-5 col-xs-12 col-sm-5">.*?<\/div><div class="newtddata col-lg-1 col-md-1 col-xs-12 col-sm-1" style="text-align:center">.*?<\/div><\/div>/gm;

    // the data will be inside the DIVs in this array
    let tableOfContent: string[] | null = slicedStr.match(regex) || [];

    // reversing the array
    tableOfContent = tableOfContent?.reverse();

    // keeping the first index (0) occupied
    tableOfContent?.unshift("start");

    // striping all html tags, so only the desired data remains
    const textContentRegex = new RegExp("</?!?(div|span|a)[^>]*>", "g");

    // array of desired data remains
    const validData: string[] | null = [];

    tableOfContent?.forEach((item, i) => {
        let str = item;
        str = str?.replace(textContentRegex, " ");
        str = str.replace(` ${i} `, "");
        validData.push(str);
    });


    for (const text of validData) {

        const removeUnwantedText = text.replace("(مشاهده اطلاعات نامه رسان)", " ");

        const countTrackingLogs = await db.trackingLog.count({
            where: {
                packageId: findTrackingCode.id
            }
        })

        const findItem = await db.trackingLog.findFirst({
            where: {
                text: {
                    contains: removeUnwantedText
                }
            }
        })

        if (!findItem && removeUnwantedText !== "start") {
            // add tracking log to the database
            await db.trackingLog.create({
                data: {
                    text: removeUnwantedText,
                    packageId: findTrackingCode.id,
                    index: countTrackingLogs + 1,
                    time: Math.ceil(Date.now() / 1000)
                }
            })



            // sending the Notification
            if (process.env.SEND_NOTIFS === "yes") {

                const apiWrapperurl = process.env.URL!
                
                await fetch(`${apiWrapperurl}/api/tg`, {
                    method: "POST",
                    body: JSON.stringify({
                        text: removeUnwantedText,
                        chat_id: Number(process.env.CHAT_ID)
                    })
                });
            }

            if (removeUnwantedText.includes("مرسوله تحویل گیرنده گردیده است")) {
                
                // disabling the code
                await db.trackingPackage.update({
                    where: {
                        id: findTrackingCode.id
                    },
                    data: {
                        isActive: false
                    }
                })
            }

        }

        
    }

    return NextResponse.json({ success: true, data: validData });
            
} catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }); 
}
}
